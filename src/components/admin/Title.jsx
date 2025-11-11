// import React from "react";

// const Title = ({ text1, text2 }) => {
//   return (
//     <div className="font-medium text-2xl">
//       {text1} <span className="underline text-primary">{text2}</span>
//     </div>
//   );
// };

// export default Title;

import React from "react";
import { motion } from "framer-motion";

const Title = ({ text1, text2, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-8"
    >
      {Icon && (
        <motion.div
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
        >
          <Icon size={28} />
        </motion.div>
      )}
      <h1 className="text-4xl font-bold">
        <span className="text-gray-800 dark:text-gray-200">{text1}</span>{" "}
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {text2}
        </span>
      </h1>
    </motion.div>
  );
};

export default Title;
