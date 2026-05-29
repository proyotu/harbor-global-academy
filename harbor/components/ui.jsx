export function Card({ className='', children }) { return <div className={className}>{children}</div>; }
export function CardContent({ className='', children }) { return <div className={className}>{children}</div>; }
export function Button({ className='', children, ...props }) { return <button className={'inline-flex items-center justify-center gap-2 transition ' + className} {...props}>{children}</button>; }
