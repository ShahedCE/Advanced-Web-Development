export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-6 text-center">
      <p>© {new Date().getFullYear()} Laundry Services. All rights reserved.</p>
      <p className="mt-2">Follow us on Facebook | Instagram | Twitter</p>
    </footer>
  );
}




// import React from 'react';
// import styles from './footer.module.css';

// const Footer: React.FC = () => {
//   return (
//     <footer className={styles.footer}>
//       © {new Date().getFullYear()} Laundry_ManageMent_system. All rights
//       reserved.
//     </footer>
//   );
// };

// export default Footer;
