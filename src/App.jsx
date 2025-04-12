import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { groupByGenre } from "./lib/utils";
import Breadcrumbs from "./components/Breadcrumbs";
import Sidebar from "./components/Sidebar";
import BooksList from "./components/BooksList";
import BookDetail from "./components/BookDetail";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://mouqkxrfwzaghtcnncgh.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdXFreHJmd3phZ2h0Y25uY2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Nzc3NDcsImV4cCI6MjA2MDA1Mzc0N30.uZUaxEhqNfgHAgW-KUYMJS9woNNunekf0nv0U16KlfY");

function App() {
  const navigate = useNavigate();
  const params = useParams();
  const [bookDetail, setBookDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);

  // Get route parameters
  const { bookId } = params;
  const { genreId } = params;
  const activeGenre = genreId ? decodeURIComponent(genreId) : null;

  // Load genres for sidebar
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*');

        if (error) throw error;
        if (!data?.length) {
          console.error("No books data found");
          return;
        }

        const genreGroups = groupByGenre(data);
        setGenres(genreGroups);
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };

    loadGenres();
  }, []);

  // Load book details when a book is selected via URL
  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetail = async () => {
      setLoading(true);
      try {
        // Get book details
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId)
          .single();

        if (bookError) throw bookError;

        // Get related books (same genre)
        const { data: relatedBooks, error: relatedError } = await supabase
          .from('books')
          .select('*')
          .eq('genre', bookData.genre)
          .neq('id', bookId)
          .limit(5);

        if (relatedError) throw relatedError;

        // Get recent books (last 5 added)
        const { data: recentBooks, error: recentError } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        // Combine the data
        const combinedData = {
          book: bookData,
          relatedBooks: relatedBooks,
          recentRecommendations: recentBooks,
          genreStats: {
            count: relatedBooks.length,
            genre: bookData.genre
          }
        };

        setBookDetail(combinedData);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookId]);

  const handleSelectBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleSelectGenre = (genre) => {
    if (genre) {
      navigate(`/genre/${encodeURIComponent(genre)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="layout">
      <Sidebar
        genres={genres}
        activeGenre={activeGenre}
        onSelectGenre={handleSelectGenre}
        counts
      />

      <main className="main-content">
        {/* Breadcrumbs for main library page */}
        {!bookId && (
          <Breadcrumbs
            items={[
              { label: "All Books", value: null },
              ...(activeGenre
                ? [{ label: activeGenre, value: activeGenre }]
                : []),
            ]}
            onNavigate={(value) => {
              if (value === null) {
                handleSelectGenre(null);
              }
            }}
          />
        )}

        <div className="page-header">
          <h1>{activeGenre ? `${activeGenre} Books` : "My Library"}</h1>
          <p className="text-gray-900">
            {activeGenre
              ? `Explore our collection of ${activeGenre.toLowerCase()} books`
              : "Discover your next favorite book"}
          </p>
        </div>

        {bookId ? (
          loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-10 w-10 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookDetail ? (
            <BookDetail bookData={bookDetail} />
          ) : (
            <div className="text-center py-20 text-gray-600">
              Error loading book details
            </div>
          )
        ) : (
          <BooksList onSelectBook={handleSelectBook} filter={activeGenre} />
        )}
      </main>
    </div>
  );
}

export default App;
