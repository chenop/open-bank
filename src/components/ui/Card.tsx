interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`rounded-xl bg-white shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }: CardProps) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }: CardProps) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={className}>{children}</div>
);
