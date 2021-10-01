import React from "react";
import Card from "../../UI/Card";

import styles from "./GameStatus.module.css";

const GameStatus = (props) => {
  const Team1Tricks = (props) => {
    return (
      <>
        <div>{props.team1Tricks}</div>
        <div>{props.team2Tricks}</div>
      </>
    );
  };
  const Team2Tricks = (props) => {
    return (
      <>
        <div>{props.team2Tricks}</div>
        <div>{props.team1Tricks}</div>
      </>
    );
  };
  const Team1Score = (props) => {
    return (
      <>
        <div>{props.team1Score}</div>
        <div>{props.team2Score}</div>
      </>
    );
  };
  const Team2Score = (props) => {
    return (
      <>
        <div>{props.team2Score}</div>
        <div>{props.team1Score}</div>
      </>
    );
  };

  return (
    <Card className="inner">
      <div className={styles.group}>
        <div className={styles.status}>
          <div>Dealer:</div>
          <div className={styles.single}>{props.dealer}</div>
        </div>
        <div className={styles.status}>
          <div>Order:</div>
          <div className={styles.double}>
            <div>{props.orderedPlayer}</div>
            <div>{props.trump}</div>
          </div>
        </div>
        <div className={styles.status}>
          <div>Tricks:</div>
          <div className={styles.double}>
            {props.teamNo === 1 ? (
              <Team1Tricks props={props} />
            ) : (
              <Team2Tricks props={props} />
            )}
          </div>
        </div>
        <div className={`${styles.status} ${styles.right}`}>
          <div>Score: </div>
          <div className={styles.double}>
          {props.teamNo === 1 ? (
              <Team1Score props={props} />
            ) : (
              <Team2Score props={props} />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameStatus;