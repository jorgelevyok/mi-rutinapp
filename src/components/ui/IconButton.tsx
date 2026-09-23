import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, iconSizes, radius } from '@/theme';

interface IconButtonProps {
  icon: LucideIcon;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  bordered?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon: Icon,
  onPress,
  size = 40,
  backgroundColor = colors.white,
  iconColor = colors.ink,
  bordered = true,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          backgroundColor,
          borderWidth: bordered ? 1 : 0,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon size={iconSizes.lg} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.full,
    borderColor: colors.sandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
