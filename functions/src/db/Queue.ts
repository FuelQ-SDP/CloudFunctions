import * as functions from "firebase-functions";

import { DataBase, Region } from "../Constant";

const logger = functions.logger;

const onCreate = functions
  .region(Region)
  .firestore.document(
    `/${DataBase.FillingStations}/{filingStationId}/${DataBase.ScheduledFilings}/{scheduledFilingsId}/${DataBase.Queue}/{queueId}`
  )
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot) => {
    const ref = snapshot.ref;
    const sfRef = ref.parent.parent;
    try {
      return sfRef
        ?.get()
        .then((doc) => {
          const _QueueNumber = doc.data()?.queueNumber;
          sfRef?.set(
            {
              queueNumber: _QueueNumber ? _QueueNumber + 1 : 1,
            },
            { merge: true }
          );
        })
        .catch((_e) => {
          logger.log(`_e ${JSON.stringify(_e)}`);
        });
    } catch (e) {
      logger.log(`e ${JSON.stringify(e)}`);
    }
  });

export const Queue = {
  onCreate,
};
