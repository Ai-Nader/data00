import { cn } from '../../lib/utils';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}

export function Link({ className, external, children, ...props }: LinkProps) {
  return (
    <a
      className={cn(
        "transition-colors duration-200",
        className
      )}
      {...props}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer"
      })}
    >
      {children}
    </a>
  );
}