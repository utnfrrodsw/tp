import styles from './AboutContainer.module.css';
type Props = {
  isAlignedRight: boolean;
  imageUrl: string;
  title: string;
  text: string;
};

function AboutContainer({ isAlignedRight, imageUrl, title, text }: Props) {
  let aboutTextTitle = styles.aboutTextTitleRight;
  let aboutTextDescription = styles.aboutTextDescriptionRight;
  let aboutImage = styles.aboutImageRight;
  let aboutText = styles.aboutTextRight;

  function alignRight(isAlignedRight: boolean) {
    if (!isAlignedRight) {
      aboutTextTitle = styles.aboutTextTitleLeft;
      aboutTextDescription = styles.aboutTextDescriptionLeft;
      aboutImage = styles.aboutImageLeft;
      aboutText = styles.aboutTextLeft;
    }
  }
  alignRight(isAlignedRight);

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <div className={aboutText}>
          <h1 className={aboutTextTitle}>{title}</h1>
          <p className={aboutTextDescription}>{text}</p>
        </div>
        <div className={aboutImage}>
          <img
            className={styles.aboutImageContent}
            src={imageUrl}
            alt="Foto about us"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutContainer;
