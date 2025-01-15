// @flow
import { FaHeart } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";

interface Props {
  color: string;
}

export const RandomHeart = ({ color }: Props) => (
  <>
    {Math.floor(Math.random() * 100) > 50 ? (
      <BiHeart color={"transparent"} fill={color} />
    ) : (
      <FaHeart color={"transparent"} fill={color} />
    )}
  </>
);
