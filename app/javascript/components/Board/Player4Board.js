import React from "react";
import Kitty from "../Interface/Kitty/Kitty";
import Card from "../UI/Card";
import Image from "../UI/Image";

import styles from "./Board.module.css";

const Player4Board = (props) => {
  if (props.showKitty === "PLACEHOLDER") {
    return (
      <Card>
        <div className={styles.board}>
          <Card className="boardcard">
            <div className={styles.placeholder}>♤♧♢♡</div>
          </Card>
        </div>
      </Card>
    );
  }
  if (props.showKitty) {
    return (
      <Card>
        <div className={`${styles.board} ${styles.kitty}`}>
          <Kitty />
        </div>
      </Card>
    );
  }
  return (
    <Card>
      <div className={styles.board}>
        <div className={styles.upper}>
          <Card className="boardcard">
            {props.p2Card ? (
              <Image src={props.p2Card} />
            ) : (
              <div className={styles.placeholder} />
            )}
          </Card>
        </div>
        <div className={styles.middle}>
          <Card className="boardcard">
            {props.p1Card ? (
              <Image src={props.p1Card} />
            ) : (
              <div className={styles.placeholder} />
            )}
          </Card>
          <Card className="boardcard">
            {props.p3Card ? (
              <Image src={props.p3Card} />
            ) : (
              <div className={styles.placeholder} />
            )}
          </Card>
        </div>
        <div className={styles.lower}></div>
        <Card className="boardcard">
          {props.p4Card ? (
            <Image src={props.p4Card} />
          ) : (
            <div className={styles.placeholder} />
          )}
        </Card>
      </div>
    </Card>
  );
};

export default Player4Board;
