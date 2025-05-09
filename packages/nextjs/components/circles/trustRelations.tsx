import { FC, useEffect } from "react";
import { AvatarInterface } from "@circles-sdk/sdk";

interface TrustRelation {
  timestamp: number;
  objectAvatar: string;
  relation: string;
}

interface TrustRelationsProps {
  avatarInfo: AvatarInterface | null;
  setTrustedCircles: (circles: string[]) => void;
  setTrustRelations: (relations: TrustRelation[]) => void;
}

const TrustRelations: FC<TrustRelationsProps> = ({
  avatarInfo,
  setTrustedCircles,
  setTrustRelations,
}) => {
  useEffect(() => {
    const trustRelationsHandle = async () => {
      try {
        if (!avatarInfo) return;

        const trustRelations = await avatarInfo.getTrustRelations();
        console.log("Trust Relations:", trustRelations);

        // Map relations for trustedCircles and differentiate by type
        const trustedCircles = trustRelations
          .filter((rel) => rel.relation === "trusts")
          .map((rel) => rel.objectAvatar);

        const mappedRelations = trustRelations.map((rel) => ({
          timestamp: rel.timestamp,
          objectAvatar: rel.objectAvatar,
          relation:
            rel.relation === "trustedBy"
              ? "Incoming Trust"
              : rel.relation === "trusts"
              ? "Outgoing Trust"
              : rel.relation === "mutuallyTrusts"
              ? "Mutually Trusted"
              : "Unknown Relation",
        }));

        // Set state
        setTrustedCircles(trustedCircles);
        setTrustRelations(mappedRelations);

        console.log(mappedRelations, "Mapped Data");
      } catch (error) {
        console.error("Error processing trust relations:", error);
      }
    };

    if (avatarInfo) {
      trustRelationsHandle();
    }
  }, [avatarInfo, setTrustedCircles, setTrustRelations]);

  return null;
};

export default TrustRelations;