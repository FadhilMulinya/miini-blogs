
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  
  return (
    <div 
      key={location.pathname}
      className="page-transition-wrapper min-h-screen pt-16 animate-in fade-in slide-in-from-bottom-8 duration-500"
    >
      {children}
    </div>
  );
};

export default PageTransition;
