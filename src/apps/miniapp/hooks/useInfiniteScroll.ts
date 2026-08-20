import { useEffect, useRef, useState, useCallback } from 'react';

export function useInfiniteScroll<T>(
  fetchData: (page: number) => Promise<T[]>,
  initialPage = 1
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchRef = useRef(fetchData);
  useEffect(() => {
    fetchRef.current = fetchData;
  }, [fetchData]);

  // Use refs for state that loadMore needs, to make it completely stable
  const pageRef = useRef(page);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    
    setLoading(true);
    loadingRef.current = true;
    
    try {
      const currentPage = pageRef.current;
      const newItems = await fetchRef.current(currentPage);
      
      if (pageRef.current !== currentPage) {
        // A reset happened while we were fetching
        return;
      }
      
      if (newItems.length === 0) {
        setHasMore(false);
        hasMoreRef.current = false;
      } else {
        setData(prev => {
          // Deduplicate by ID to prevent React key errors
          const existingIds = new Set(prev.map((item: any) => item.id));
          const uniqueNewItems = newItems.filter((item: any) => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });
        setPage(p => p + 1);
        pageRef.current += 1;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const reset = useCallback(async () => {
    setData([]);
    setPage(initialPage);
    pageRef.current = initialPage;
    setHasMore(true);
    hasMoreRef.current = true;
    
    // Trigger initial load
    await loadMore();
  }, [initialPage, loadMore]);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingRef.current) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreRef.current) {
        loadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loadMore]);

  return { data, setData, loading, hasMore, lastElementRef, loadMore, reset };
}
