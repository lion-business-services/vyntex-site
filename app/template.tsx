/** Do not hide server-rendered page content with an initial opacity of zero.
 * Individual interactive sections retain their optional motion effects.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
