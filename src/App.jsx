import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { groupByCategory } from "./lib/utils";
import Breadcrumbs from "./components/Breadcrumbs";
import Sidebar from "./components/Sidebar";
import DiecastList from "./components/DiecastList";
import DiecastDetail from "./components/DiecastDetail";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://mouqkxrfwzaghtcnncgh.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdXFreHJmd3phZ2h0Y25uY2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Nzc3NDcsImV4cCI6MjA2MDA1Mzc0N30.uZUaxEhqNfgHAgW-KUYMJS9woNNunekf0nv0U16KlfYxf");

function App() {
  const navigate = useNavigate();
  const params = useParams();
  const [diecastDetail, setDiecastDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const { diecastId } = params;
  const { categoryId } = params;
  const activeCategory = categoryId ? decodeURIComponent(categoryId) : null;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase.from('diecasts').select('*');
        if (error) throw error;
        if (!data?.length) return;
        setCategories(groupByCategory(data));
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!diecastId) return;
    const fetchDiecastDetail = async () => {
      setLoading(true);
      try {
        const { data: diecastData, error: diecastError } = await supabase
          .from('diecasts')
          .select('*')
          .eq('id', diecastId)
          .single();
        if (diecastError) throw diecastError;
        setDiecastDetail({
          diecast: diecastData,
          relatedDiecasts: [],
          recentRecommendations: [],
          categoryStats: { count: 0, category: diecastData.category }
        });
      } catch (error) {
        console.error("Error fetching diecast details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiecastDetail();
  }, [diecastId]);

  const handleSelectDiecast = (diecastId) => navigate(`/diecast/${diecastId}`);
  const handleSelectCategory = (category) => navigate(category ? `/category/${encodeURIComponent(category)}` : "/");

  return (
    <div className="layout">
      <Sidebar categories={categories} activeCategory={activeCategory} onSelectCategory={handleSelectCategory} counts />
      <main className="main-content">
        {!diecastId && (
          <Breadcrumbs
            items={[
              { label: "All Diecasts", value: null },
              ...(activeCategory ? [{ label: activeCategory, value: activeCategory }] : []),
            ]}
            onNavigate={(value) => value === null && handleSelectCategory(null)}
          />
        )}
        <div className="page-header">
          <h1>{activeCategory ? `${activeCategory} Diecasts` : "Diecast Marketplace"}</h1>
          <p className="text-gray-900">
            {activeCategory ? `Explore our ${activeCategory.toLowerCase()} diecasts` : "Discover your next collectible"}
          </p>
        </div>
        {diecastId ? (
          loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-10 w-10 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : diecastDetail ? (
            <DiecastDetail diecastData={diecastDetail} />
          ) : (
            <div className="text-center py-20 text-gray-600">Error loading diecast details</div>
          )
        ) : (
          <DiecastList onSelectDiecast={handleSelectDiecast} filter={activeCategory} />
        )}
      </main>
    </div>
  );
}

export default App;
