import styles from './Alert.module.css';

interface Props {
    message: string;
}
const Alert = ({message}: Props) => {
    return (
        <div className={styles.alertContainer} role="alert">
            <svg className={styles.icon} viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />     
            </svg>
            <span className={styles.message}>{message}</span>
        </div>
    );
}
export default Alert;   