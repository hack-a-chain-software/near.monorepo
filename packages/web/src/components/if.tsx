type Props = {
  condition: boolean;
  children: React.ReactNode;
  fallback?: JSX.Element;
};

export function If({
  children,
  fallback = <div />,
  condition,
}: Props): JSX.Element {
  return condition ? children : fallback;
}
