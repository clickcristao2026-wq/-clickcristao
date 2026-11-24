export function DashboardIcon({ src, color, className }: { src: string; color: string; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ backgroundColor: color, mask: `url(${src}) center / contain no-repeat` }}
    />
  );
}
