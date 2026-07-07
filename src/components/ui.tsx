import React from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { X } from 'lucide-react-native'
import { colors, radius, space } from '../theme'

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>

/* ---------- Screen shell ---------- */
export function Screen({
  title,
  subtitle,
  right,
  children,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.h1}>{title}</Text>
            {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
        {children}
        <View style={{ height: space(6) }} />
      </ScrollView>
    </SafeAreaView>
  )
}

/* ---------- Card ---------- */
export function Card({
  children,
  style,
}: {
  children: React.ReactNode
  style?: object
}) {
  return <View style={[s.card, style]}>{children}</View>
}

/* ---------- Stat tile ---------- */
export function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  tint = colors.accent400,
}: {
  icon: IconType
  label: string
  value: string | number
  sub?: string
  tint?: string
}) {
  return (
    <Card style={s.statTile}>
      <View style={[s.iconChip, { backgroundColor: tint + '22' }]}>
        <Icon size={18} color={tint} strokeWidth={2.2} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
      {sub ? <Text style={s.statSub}>{sub}</Text> : null}
    </Card>
  )
}

/* ---------- Badge ---------- */
export function Badge({
  label,
  color = colors.textDim,
}: {
  label: string
  color?: string
}) {
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{label}</Text>
    </View>
  )
}

/* ---------- Section header (card titles) ---------- */
export function SectionHeader({
  icon: Icon,
  title,
  onPress,
}: {
  icon: IconType
  title: string
  onPress?: () => void
}) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.row}>
        <Icon size={16} color={colors.accent300} strokeWidth={2.2} />
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      {onPress ? (
        <Pressable onPress={onPress} hitSlop={8}>
          <Text style={s.viewAll}>View all ›</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

/* ---------- Buttons ---------- */
export function PrimaryButton({
  label,
  icon: Icon,
  onPress,
  small,
}: {
  label: string
  icon?: IconType
  onPress: () => void
  small?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        s.btnPrimary,
        small && s.btnSmall,
        pressed && s.pressed,
      ]}
    >
      {Icon ? <Icon size={small ? 15 : 17} color={colors.white} strokeWidth={2.4} /> : null}
      <Text style={s.btnPrimaryText}>{label}</Text>
    </Pressable>
  )
}

export function GhostButton({
  label,
  onPress,
}: {
  label: string
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.btn, s.btnGhost, pressed && s.pressed]}
    >
      <Text style={s.btnGhostText}>{label}</Text>
    </Pressable>
  )
}

export function IconButton({
  icon: Icon,
  onPress,
  danger,
}: {
  icon: IconType
  onPress: () => void
  danger?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [s.iconBtn, pressed && s.pressed]}
    >
      <Icon size={17} color={danger ? colors.rose : colors.textDim} strokeWidth={2.2} />
    </Pressable>
  )
}

/* ---------- Empty state ---------- */
export function EmptyState({
  icon: Icon,
  title,
  hint,
  actionLabel,
  onAction,
}: {
  icon: IconType
  title: string
  hint?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        <Icon size={24} color={colors.textFaint} strokeWidth={1.8} />
      </View>
      <Text style={s.emptyTitle}>{title}</Text>
      {hint ? <Text style={s.emptyHint}>{hint}</Text> : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: space(4) }}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  )
}

/* ---------- Progress bar (mini chart) ---------- */
export function ProgressBar({
  value,
  max,
  color = colors.accent500,
}: {
  value: number
  max: number
  color?: string
}) {
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0))
  return (
    <View style={s.track}>
      <View style={[s.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  )
}

/* ---------- Modal ---------- */
export function AppModal({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.modalWrap} pointerEvents="box-none">
        <View style={s.modalCard}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{title}</Text>
            <IconButton icon={X} onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
        </View>
      </View>
    </Modal>
  )
}

/* ---------- Form fields ---------- */
export function TextField({
  label,
  ...props
}: { label: string } & TextInputProps) {
  return (
    <View style={{ marginBottom: space(4) }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textFaint}
        style={s.input}
        {...props}
      />
    </View>
  )
}

export function ChipSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <View style={{ marginBottom: space(4) }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={s.chipRow}>
        {options.map((opt) => {
          const active = opt === value
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={[s.chip, active && s.chipActive]}
            >
              <Text style={[s.chipText, active && s.chipTextActive]}>{opt}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

export const styles = { colors, radius, space }

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink900 },
  scrollContent: { padding: space(5), paddingBottom: space(10) },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space(3),
    marginBottom: space(5),
  },
  h1: { color: colors.white, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: colors.textDim, fontSize: 13, marginTop: space(1) },

  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space(4),
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: space(2) },

  statTile: { flex: 1, minWidth: 150, padding: space(4) },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
    marginTop: space(3),
    letterSpacing: -0.5,
  },
  statLabel: { color: colors.textDim, fontSize: 13, marginTop: space(1) },
  statSub: { color: colors.textFaint, fontSize: 11, marginTop: space(1.5) },

  badge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: space(2),
    paddingVertical: space(0.5),
  },
  badgeText: { fontSize: 11, fontWeight: '600' },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { color: colors.white, fontSize: 14, fontWeight: '700' },
  viewAll: { color: colors.textDim, fontSize: 12, fontWeight: '600' },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space(2),
    borderRadius: radius.md,
    paddingHorizontal: space(3.5),
    paddingVertical: space(2.5),
  },
  btnSmall: { paddingHorizontal: space(3), paddingVertical: space(2) },
  btnPrimary: { backgroundColor: colors.accent500 },
  btnPrimaryText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  btnGhost: { backgroundColor: colors.surfaceStrong, borderWidth: 1, borderColor: colors.border },
  btnGhostText: { color: colors.text, fontWeight: '600', fontSize: 14 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space(14),
    paddingHorizontal: space(6),
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space(3),
  },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  emptyHint: {
    color: colors.textFaint,
    fontSize: 13,
    textAlign: 'center',
    marginTop: space(1.5),
    maxWidth: 300,
    lineHeight: 19,
  },

  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.pill },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(6,6,10,0.72)',
  },
  modalWrap: { flex: 1, justifyContent: 'center', padding: space(5) },
  modalCard: {
    backgroundColor: colors.ink850,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space(5),
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space(4),
  },
  modalTitle: { color: colors.white, fontSize: 18, fontWeight: '700' },

  fieldLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: space(1.5),
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space(3),
    paddingVertical: space(2.5),
    color: colors.white,
    fontSize: 15,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: space(3),
    paddingVertical: space(1.5),
  },
  chipActive: { backgroundColor: colors.accent500, borderColor: colors.accent500 },
  chipText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: colors.white },
})
