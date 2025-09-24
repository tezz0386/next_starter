export function classNames(...args: (string | false | undefined | null)[]): string {
  return args.filter(Boolean).join(' ');
}
