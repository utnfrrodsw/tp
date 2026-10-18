import styles from './Button1.module.css';

interface Props {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const CustomButton1 = ({ text, onClick, type = "button", disabled }: Props) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={styles.mainButton}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
export default CustomButton1;
