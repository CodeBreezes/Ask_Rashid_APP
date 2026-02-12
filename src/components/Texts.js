import React from "react";
import { Text } from "react-native";
import { getFont } from "../utils/fontHelper"; 

const Texts = ({ style, children, ...props }) => {
  return (
    <Text
      style={[
        { fontFamily: getFont() }, 
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default Texts;
