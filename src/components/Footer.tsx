const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center p-4">
      <p className="text-gray-800 dark:text-gray-300">
        &copy; {new Date().getFullYear()} Warren Wu Zhe. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
