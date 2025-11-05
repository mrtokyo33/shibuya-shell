package utils

import (
	"fmt"
	"sync"
	"time"
)

const (
	epoch           = int64(1609459200000)
	timestampBits   = 41
	datacenterBits  = 5
	workerBits      = 5
	sequenceBits    = 12
	maxDatacenterID = -1 ^ (-1 << datacenterBits)
	maxWorkerID     = -1 ^ (-1 << workerBits)
	maxSequence     = -1 ^ (-1 << sequenceBits)
	workerShift     = sequenceBits
	datacenterShift = sequenceBits + workerBits
	timestampShift  = sequenceBits + workerBits + datacenterBits
)

type SnowflakeGenerator struct {
	mu           sync.Mutex
	datacenterID int64
	workerID     int64
	sequence     int64
	lastTime     int64
}

var defaultGenerator *SnowflakeGenerator
var once sync.Once

func InitSnowflake(datacenterID, workerID int64) error {
	if datacenterID < 0 || datacenterID > maxDatacenterID {
		return fmt.Errorf("datacenter ID must be between 0 and %d", maxDatacenterID)
	}
	if workerID < 0 || workerID > maxWorkerID {
		return fmt.Errorf("worker ID must be between 0 and %d", maxWorkerID)
	}

	once.Do(func() {
		defaultGenerator = &SnowflakeGenerator{
			datacenterID: datacenterID,
			workerID:     workerID,
			sequence:     0,
			lastTime:     0,
		}
	})
	return nil
}

func GenerateSnowflakeID() (int64, error) {
	if defaultGenerator == nil {
		if err := InitSnowflake(1, 1); err != nil {
			return 0, err
		}
	}
	return defaultGenerator.Generate()
}

func (s *SnowflakeGenerator) Generate() (int64, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().UnixMilli()

	if now < s.lastTime {
		for now < s.lastTime {
			time.Sleep(time.Millisecond)
			now = time.Now().UnixMilli()
		}
	}

	if now == s.lastTime {
		s.sequence = (s.sequence + 1) & maxSequence
		if s.sequence == 0 {
			for now <= s.lastTime {
				now = time.Now().UnixMilli()
			}
		}
	} else {
		s.sequence = 0
	}

	s.lastTime = now

	id := ((now - epoch) << timestampShift) |
		(s.datacenterID << datacenterShift) |
		(s.workerID << workerShift) |
		s.sequence

	return id, nil
}