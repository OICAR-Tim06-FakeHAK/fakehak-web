import { useState }       from "react";
import { useApp }         from "../context/AppContext.jsx";
import { AppShell }       from "../components/layout/index.jsx";
import { CaseListPanel }  from "../components/cases/index.jsx";
import { CaseDetailPanel } from "../components/cases/CaseDetail.jsx";
import { CreateCaseModal } from "../components/cases/CreateCaseModal.jsx";

export function DashboardPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { setSelectedId, refresh }  = useApp();

  function handleCreated(newCase) {
    setShowCreate(false);
    refresh();
    setSelectedId(newCase.id);
  }

  return (
    <AppShell onNewCase={() => setShowCreate(true)}>
      <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
        <CaseListPanel />
        <CaseDetailPanel />
      </div>

      {showCreate && (
        <CreateCaseModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </AppShell>
  );
}
