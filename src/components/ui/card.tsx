import { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
  [key: string]: any;
}

export const Card = ({ className, children, ...props }: CardProps) => (
  <div className={`rounded-lg ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }: CardProps) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: CardProps) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ className, children, ...props }: CardProps) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);