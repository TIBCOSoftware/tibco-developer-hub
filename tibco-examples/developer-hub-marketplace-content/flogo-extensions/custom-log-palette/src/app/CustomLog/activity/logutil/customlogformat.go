package logutil

import (
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"
)

// FormatCustomLog writes a log line in custom log format.
// logData: map of key-value pairs (all values converted to string)
// format: "json" for JSON output (case-insensitive, whitespace trimmed), otherwise text format
// level: INFO, DEBUG, ERROR, WARN
// loggerName: full logger/class name (e.g. flogo.CustomLog.activity.customlog.app.flow.activity)
//
// Text format: 2026-02-13T16:53:47,498 INFO  [loggerName] - a_key1="val1", a_key2="val2"
// JSON format: same data as JSON object with timestamp, level, logger, data
func FormatCustomLog(logData map[string]interface{}, format string, level string, loggerName string) string {
	// Build ordered key list: standard keys first, then custom keys (contextParams, additionalLogParams) alphabetically
	standardOrder := []string{
		"applicationName", "processName", "jobId", "processInstanceId",
		"level", "activityName", "timeStamp",
		"sessionId", "sender", "traceID", "serviceScope", "correlationId",
		"trackingId", "logFormat", "targetSystem", "message",
		"errorCode", "errorMessage", "errorData",
	}
	seen := make(map[string]bool)
	var orderedKeys []string
	for _, k := range standardOrder {
		if _, ok := logData[k]; ok && !seen[k] {
			orderedKeys = append(orderedKeys, k)
			seen[k] = true
		}
	}
	var customKeys []string
	for k := range logData {
		if !seen[k] {
			customKeys = append(customKeys, k)
		}
	}
	sort.Strings(customKeys)
	orderedKeys = append(orderedKeys, customKeys...)

	now := time.Now()
	timestamp := now.Format("2006-01-02T15:04:05.000000")
	timestampShort := now.Format("2006-01-02T15:04:05") + "," + fmt.Sprintf("%03d", now.Nanosecond()/1000000)
	levelUpper := strings.ToUpper(level)

	if strings.TrimSpace(strings.ToLower(format)) == "json" {
		// JSON format: ordered flat structure, built with strings.Builder for fewer allocations
		// 1. metadata | 2. tracking | 3. message | 4. standard params | 5. exception params | 6. additional
		dataKeys := []string{
			"applicationName", "processName", "jobId", "processInstanceId",
			"activityName", "sessionId", "correlationId", "trackingId",
			"timeStamp", "level", "message",
			"logFormat", "targetSystem",
			"errorCode", "errorMessage", "errorData",
		}
		outputKeys := []string{
			"a_applicationName", "a_processName", "a_jobId", "a_processInstanceId",
			"a_activityName", "a_sessionId", "a_correlationId", "a_trackingId",
			"a_timeStamp", "a_level", "a_message",
			"a_logFormat", "a_targetSystem",
			"a_errorCode", "a_errorMessage", "a_errorData",
		}
		seen := make(map[string]bool)
		var b strings.Builder
		b.Grow(1024)
		appendJSONPair := func(key, val string) {
			if val == "" {
				return
			}
			if b.Len() > 1 {
				b.WriteByte(',')
			}
			escaped, _ := json.Marshal(key)
			b.Write(escaped)
			b.WriteByte(':')
			escaped, _ = json.Marshal(val)
			b.Write(escaped)
		}
		b.WriteByte('{')
		appendJSONPair("timestamp", timestamp)
		appendJSONPair("level", levelUpper)
		appendJSONPair("logger", loggerName)
		for i, k := range dataKeys {
			if v, ok := logData[k]; ok {
				s := toString(v)
				if s != "" {
					appendJSONPair(outputKeys[i], s)
					seen[k] = true
				}
			}
		}
		for _, k := range orderedKeys {
			if seen[k] {
				continue
			}
			s := toString(logData[k])
			if s != "" {
				appendJSONPair("a_"+k, s)
			}
		}
		b.WriteByte('}')
		return b.String()
	}

	// Text format (skip empty values)
	var pairs []string
	for _, k := range orderedKeys {
		v := logData[k]
		s := toString(v)
		if s != "" {
			pairs = append(pairs, fmt.Sprintf("a_%s=%q", k, s))
		}
	}
	msgPart := strings.Join(pairs, ", ")
	return fmt.Sprintf("%s %-5s [%s] - %s",
		timestampShort, levelUpper, loggerName, msgPart)
}

// BuildCustomFlowInfoMap builds a map with all Header fields + contextParams keyValuePair.
// Returns map[string]interface{} for direct scope storage (no JSON marshaling overhead).
func BuildCustomFlowInfoMap(header interface{}, contextParams interface{}) map[string]interface{} {
	out := make(map[string]interface{})
	for k, v := range ExtractAllHeaderFields(header) {
		out[k] = v
	}
	for k, v := range ExtractKeyValuePairs(contextParams) {
		out[k] = v
	}
	return out
}

// ExtractAllHeaderFields extracts ALL key-value pairs from Header object (not just predefined keys).
func ExtractAllHeaderFields(val interface{}) map[string]interface{} {
	out := make(map[string]interface{})
	if val == nil {
		return out
	}
	var m map[string]interface{}
	switch v := val.(type) {
	case map[string]interface{}:
		m = v
	case string:
		json.Unmarshal([]byte(v), &m)
	default:
		return out
	}
	if m == nil {
		return out
	}
	// Handle complex_object with value.value
	if vv, ok := m["value"]; ok {
		if s, ok := vv.(string); ok {
			json.Unmarshal([]byte(s), &m)
		} else if mm, ok := vv.(map[string]interface{}); ok {
			m = mm
		}
	}
	// Extract all fields except metadata
	for k, v := range m {
		if k != "metadata" && v != nil && v != "" {
			out[k] = v
		}
	}
	// If contextParams is nested in Header, flatten its keyValuePair into the map
	if cp, ok := m["contextParams"]; ok {
		for k, v := range ExtractKeyValuePairs(map[string]interface{}{"keyValuePair": cp}) {
			out[k] = v
		}
	}
	return out
}

// ExtractHeaderFields extracts header fields (sessionId, correlationId, etc.) from Header object.
func ExtractHeaderFields(val interface{}) map[string]interface{} {
	out := make(map[string]interface{})
	if val == nil {
		return out
	}
	var m map[string]interface{}
	switch v := val.(type) {
	case map[string]interface{}:
		m = v
	case string:
		json.Unmarshal([]byte(v), &m)
	default:
		return out
	}
	if m == nil {
		return out
	}
	// Handle complex_object with value.value
	if vv, ok := m["value"]; ok {
		if s, ok := vv.(string); ok {
			json.Unmarshal([]byte(s), &m)
		} else if mm, ok := vv.(map[string]interface{}); ok {
			m = mm
		}
	}
	headerKeys := []string{"sessionId", "correlationId", "trackingId", "sender", "serviceScope", "flowId", "traceID"}
	for _, k := range headerKeys {
		if v, ok := m[k]; ok && v != nil && v != "" {
			out[k] = v
		}
	}
	// Extract contextParams from Header if nested
	if cp, ok := m["contextParams"]; ok {
		for k, v := range ExtractKeyValuePairs(map[string]interface{}{"keyValuePair": cp}) {
			out[k] = v
		}
	}
	return out
}

// ExtractKeyValuePairs extracts name/value pairs from various structures.
// Supports: map with "keyValuePair" array (items: {name, value} or {key, value}),
// map with flat key-value pairs, complex_object with value.value as JSON string.
func ExtractKeyValuePairs(val interface{}) map[string]interface{} {
	out := make(map[string]interface{})
	if val == nil {
		return out
	}
	switch v := val.(type) {
	case map[string]interface{}:
		if kvs, ok := v["keyValuePair"].([]interface{}); ok {
			for _, item := range kvs {
				if m, ok := item.(map[string]interface{}); ok {
					name, _ := m["name"].(string)
					if name == "" {
						name, _ = m["key"].(string)
					}
					value := m["value"]
					if name != "" {
						out[name] = value
					}
				}
			}
			return out
		}
		// Flat map - exclude metadata keys
		for k, val := range v {
			if k != "metadata" && k != "value" {
				out[k] = val
			}
		}
	case string:
		var parsed map[string]interface{}
		if err := json.Unmarshal([]byte(v), &parsed); err == nil {
			return ExtractKeyValuePairs(parsed)
		}
	}
	return out
}

// ExtractParamsFromInput extracts parameter values from Input complex_object.
// Supports: value.value as JSON string with "parameters" array or flat object,
// or map with parameter values keyed by parameterName.
func ExtractParamsFromInput(val interface{}) map[string]interface{} {
	out := make(map[string]interface{})
	if val == nil {
		return out
	}
	switch v := val.(type) {
	case map[string]interface{}:
		if valueVal, ok := v["value"]; ok {
			switch valueStr := valueVal.(type) {
			case string:
				var parsed map[string]interface{}
				if err := json.Unmarshal([]byte(valueStr), &parsed); err == nil {
					return ExtractParamsFromInput(parsed)
				}
			case map[string]interface{}:
				return ExtractParamsFromInput(valueVal)
			}
		}
		// Check for parameters array
		if params, ok := v["parameters"].([]interface{}); ok {
			for _, p := range params {
				if m, ok := p.(map[string]interface{}); ok {
					name, _ := m["parameterName"].(string)
					// Value might be in "value" or resolved at runtime
					if val, ok := m["value"]; ok && name != "" {
						out[name] = val
					}
				}
			}
			return out
		}
		// Flat params: loggerName, logFormat, targetSystem, message
		for k, val := range v {
			if k != "metadata" && k != "value" {
				out[k] = val
			}
		}
	case string:
		var parsed map[string]interface{}
		if err := json.Unmarshal([]byte(v), &parsed); err == nil {
			return ExtractParamsFromInput(parsed)
		}
	}
	return out
}

func toString(v interface{}) string {
	if v == nil {
		return ""
	}
	switch x := v.(type) {
	case string:
		return x
	case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64:
		return fmt.Sprintf("%d", x)
	case float32, float64:
		return fmt.Sprintf("%g", x)
	case bool:
		return fmt.Sprintf("%t", x)
	default:
		return fmt.Sprintf("%v", v)
	}
}
