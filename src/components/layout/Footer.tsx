
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-content border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto">
        <p>© {currentYear} IST Africa. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
