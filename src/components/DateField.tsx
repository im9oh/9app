import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { TextField } from './ui'
import { colors, radius, space } from '../theme'
import { addDaysISO, formatDate, todayISO } from '../lib/format'

// A lightweight date input: YYYY-MM-DD text plus quick-set chips.
// Avoids native date-picker modules so it runs identically in Expo Go and on web.
const QUICK: { label: string; days: number }[] = [
  { label: 'Today', days: 0 },
  { label: '+1w', days: 7 },
  { label: '+2w', days: 14 },
  { label: '+1m', days: 30 },
]

export function DateField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <View style={{ marginBottom: space(4) }}>
      <TextField
        label={label}
        value={value}
        onChangeText={onChange}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={styles.row}>
        <Text style={styles.preview}>{formatDate(value)}</Text>
        <View style={styles.chips}>
          {QUICK.map((q) => (
            <Pressable
              key={q.label}
              onPress={() => onChange(addDaysISO(todayISO(), q.days))}
              style={styles.chip}
            >
              <Text style={styles.chipText}>{q.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -space(2),
  },
  preview: { color: colors.textFaint, fontSize: 12 },
  chips: { flexDirection: 'row', gap: space(1.5) },
  chip: {
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceStrong,
    paddingHorizontal: space(2.5),
    paddingVertical: space(1),
  },
  chipText: { color: colors.accent300, fontSize: 12, fontWeight: '600' },
})
