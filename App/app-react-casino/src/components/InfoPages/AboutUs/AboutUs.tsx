
import './AboutUs.css';
import { useDefaultScroll } from "../../../libs/globalFunctions.tsx";

export function AboutUs() {
    useDefaultScroll()

    return (
        <div className="au-container">
            <h1 className="au-title">About UTimbaN</h1>
            <div className="au-data">
                <p>Welcome to UTimbaN, the online entertainment destination where the excitement of gaming and fun meet. At UTimbaN, we believe that each visit should be a unique experience, full of adrenaline and great opportunities. Founded by a team of gaming enthusiasts, UTimbaN has been designed to offer you an attractive and accessible platform. Our goal is to provide players with a high-quality virtual casino experience, with a wide range of games, exciting promotions and a safe and reliable environment.</p>
                
                <h2 className="sub-title">Our Mission</h2>
                <p>At UTimbaN, our mission is to revolutionize the way you enjoy online casinos. We are committed to providing you with a fair and fun gaming environment, where every player, new or experienced, can find their place. We work tirelessly to improve our platform and ensure that every game is fair and transparent.</p>
                
                <h2 className="sub-title">Games and Promotions</h2>
                <p>Explore our diverse selection of games, ranging from classic slots to exciting poker and blackjack tables, all optimized to offer you stunning graphics and smooth gameplay. Plus, we offer ongoing promotions so there's always something exciting to discover.</p>
                
                <h2 className="sub-title">Commitment with Security</h2>
                <p>The safety of our players is our top priority. At UTimbaN, we use the most advanced technology to ensure that your information is protected and your transactions are secure. Play with peace of mind, knowing that we are here to take care of you.</p>
                
                <h2 className="sub-title">Join the UTimbaN Experience</h2>
                <p>We invite you to join our exciting community of players. Whether you are a novice or an expert, at UTimbaN you will find a place to enjoy the game like never before. Sign up today and discover everything we have to offer you!</p>
            </div>
        </div>
    );
}
