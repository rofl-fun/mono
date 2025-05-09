// import { useEffect, useState } from "react";
// import { useCircles } from "../context/CirclesContext";

// interface GroupInfo {
//   id: string;
//   name: string;
//   type: "alpha" | "cabal";
//   members: number;
//   avgPnl: number;
//   joinPrice: number;
//   description: string;
//   lastActive: string;
// }

// export const useCirclesGroups = () => {
//   const { sdk, isLoading, error } = useCircles();
//   const [groups, setGroups] = useState<GroupInfo[]>([]);
//   const [isLoadingGroups, setIsLoadingGroups] = useState(false);
//   const [errorGroups, setErrorGroups] = useState<Error | null>(null);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       if (!sdk) return;

//       try {
//         setIsLoadingGroups(true);
//         setErrorGroups(null);

//         // TODO: Replace with actual Circles SDK calls
//         // This is a placeholder for the actual implementation
//         const fetchedGroups = await sdk.findGroups();

//         // Transform the data to match our interface
//         const transformedGroups = fetchedGroups.map(group => ({
//           id: group.id,
//           name: group.name,
//           type: group.type,
//           members: group.members.length,
//           avgPnl: group.avgPnl || 0,
//           joinPrice: group.joinPrice || 0,
//           description: group.description || "",
//           lastActive: group.lastActive || new Date().toISOString(),
//         }));

//         setGroups(transformedGroups);
//       } catch (err) {
//         setErrorGroups(err instanceof Error ? err : new Error('Failed to fetch groups'));
//       } finally {
//         setIsLoadingGroups(false);
//       }
//     };

//     fetchGroups();
//   }, [sdk]);

//   const joinGroup = async (groupId: string) => {
//     if (!sdk) throw new Error('Circles SDK not initialized');

//     try {
//       // TODO: Implement actual join group logic using Circles SDK
//       await sdk.joinGroup(groupId);
//       // Refresh groups after joining
//       // await fetchGroups();
//     } catch (err) {
//       throw err instanceof Error ? err : new Error('Failed to join group');
//     }
//   };

//   return {
//     groups,
//     isLoading: isLoading || isLoadingGroups,
//     error: error || errorGroups,
//     joinGroup,
//   };
// };