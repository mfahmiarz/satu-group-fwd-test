// components/Footer.tsx
const Footer = () => {
  return (
    <footer className="px-20 pb-8 text-slate-900">
      <div className="container mx-auto text-center ">
        <p>&copy; {new Date().getFullYear()} Satu Group. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
