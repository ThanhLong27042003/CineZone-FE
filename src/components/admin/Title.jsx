import React from "react";

const Title = ({ text1, text2, icon: Icon }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
        {Icon && <Icon className="text-gray-700" />}
        <span>{text1}</span>
        <span className="text-gray-600">{text2}</span>
      </h1>
    </div>
  );
};

export default Title;
