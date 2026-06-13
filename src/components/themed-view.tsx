import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const color = scheme === 'dark' ? darkColor : lightColor;

  return (
    <View
      style={[
        { backgroundColor: color ?? theme[type ?? 'background'] },
        style,
      ]}
      {...otherProps}
    />
  );
}
