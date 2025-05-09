import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";

interface TrustRelation {
  timestamp: number;
  objectAvatar: string;
  relation: string;
}

interface DashboardProps {
  initialTrustRelations?: TrustRelation[];
}

const Dashboard: FC<DashboardProps> = ({ initialTrustRelations = [] }) => {
  const router = useRouter();
  const [trustRelations, setTrustRelations] = useState<TrustRelation[]>(initialTrustRelations);

  const handleNavigateToMainPage = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-base-100">
      <div className="w-full h-full max-w-none bg-base-200 shadow-lg rounded-none overflow-hidden">
        <header className="bg-base-300 px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Trusts Connection Dashboard</h1>
          <button
            onClick={handleNavigateToMainPage}
            className="btn btn-primary"
          >
            Go back to Circles Playground
          </button>
        </header>
        <main className="p-6 h-[calc(100vh-60px)]">
          <div className="bg-base-100 p-5 rounded-lg h-full">
            {trustRelations.length === 0 ? (
              <p>No trust relations found!</p>
            ) : (
              <div className="overflow-auto h-full">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Relation</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trustRelations.map((relation, index) => (
                      <tr key={index}>
                        <td>{new Date(relation.timestamp * 1000).toLocaleDateString()}</td>
                        <td>{relation.relation}</td>
                        <td className="font-mono text-sm">{relation.objectAvatar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;