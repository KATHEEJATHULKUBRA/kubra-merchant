// import React from 'react';

// interface KubraLogoProps {
//   className?: string;
//   size?: 'sm' | 'md' | 'lg';
// }

// export default function KubraLogo({ className = '', size = 'md' }: KubraLogoProps) {
//   const sizes = {
//     sm: 'h-8',
//     md: 'h-10',
//     lg: 'h-16'
//   };

//   return (
//     <svg 
//       className={`${sizes[size]} ${className}`} 
//       viewBox="0 0 300 100" 
//       xmlns="/src/assets/basket.png"
//     >
//       {/* Shopping Cart with Flower */}
//       <g fill="#B33B86">
//         <path d="M37.5,60 C35.5,60 24,60 24,60 L24,48 L60,48 L60,60 C60,60 39.5,60 37.5,60 Z" stroke="#B33B86" strokeWidth="2" fill="none"/>
//         <path d="M24,48 L16,24 L12,24 M60,48 L68,24 L72,24" stroke="#B33B86" strokeWidth="2" fill="none"/>
//         <path d="M16,24 L72,24" stroke="#B33B86" strokeWidth="2"/>
//         <circle cx="30" cy="66" r="5" />
//         <circle cx="54" cy="66" r="5" />
//         <circle cx="19" cy="19" r="9" fill="#F8D7DB" stroke="#B33B86" strokeWidth="1.5"/>
//         <path d="M19,16 L19,22 M16,19 L22,19" stroke="#B33B86" strokeWidth="1.5"/>
//         <circle cx="19" cy="19" r="3" fill="#E198B4"/>
//       </g>

//       {/* KUBRA Text */}
//       <g fill="#B33B86">
//         <path d="M85,30 L85,70 L95,70 L95,55 L105,70 L120,70 L105,50 L120,30 L105,30 L95,45 L95,30 Z"/>
//         <path d="M125,30 L125,70 L150,70 L150,60 L135,60 L135,55 L145,55 L145,45 L135,45 L135,40 L150,40 L150,30 Z"/>
//         <path d="M155,30 L155,70 L165,70 L165,60 C165,60 170,60 170,60 C180,60 185,55 185,45 C185,35 180,30 170,30 Z M165,40 L170,40 C174,40 175,42 175,45 C175,48 174,50 170,50 L165,50 Z"/>
//         <path d="M190,30 L190,70 L215,70 L215,60 L200,60 L200,30 Z"/>
//         <path d="M220,30 L220,70 L245,70 L245,60 L230,60 L230,30 Z"/>
//       </g>

//       {/* market Text */}
//       <g fill="#E198B4">
//         <path d="M180,80 C180,80 183,75 188,75 C193,75 196,80 196,80 C196,80 199,75 204,75 C209,75 212,80 212,80 L212,90 L207,90 L207,83 C207,83 206,81 204,81 C202,81 201,83 201,83 L201,90 L196,90 L196,83 C196,83 195,81 193,81 C191,81 190,83 190,83 L190,90 L185,90 L185,83 C185,83 184,81 182,81 C180,81 179,83 179,83 L179,90 L174,90 L174,83 C174,83 173,81 171,81 C169,81 168,83 168,83 L168,90 L163,90 L163,80 C163,80 166,75 171,75 C176,75 179,80 179,80 Z"/>
//         <path d="M214,75 L219,75 L219,90 L214,90 Z"/>
//         <path d="M225,75 L230,75 L230,85 L238,85 L238,90 L225,90 Z"/>
//         <path d="M245,75 L250,75 L250,90 L245,90 Z M242,75 L247,75 L247,80 L242,80 Z"/>
//         <path d="M255,75 L260,75 L260,80 C260,80 263,75 268,75 L270,75 L270,80 L268,80 C263,80 260,83 260,83 L260,90 L255,90 Z"/>
//       </g>
//     </svg>
//   );
// }

import React from 'react';
import basketLogo from '/src/assets/bg-removed.png'; // Adjust path if needed

interface KubraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function KubraLogo({ className = '', size = 'md' }: KubraLogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-20',
    lg: 'h-16',
  };

  return (
    <img
      src={basketLogo}
      alt="Kubra Logo"
      className={`${sizes[size]} ${className}`}
    />
  );
}

