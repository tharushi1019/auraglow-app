import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import ProductFilterSidebar from '@/components/catalog/ProductFilterSidebar';
import ProductQuickViewModal from '@/components/catalog/ProductQuickViewModal';
import { getProducts, getCategories } from '@/services/productService';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'bestseller';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [filters, setFilters] = useState({
    isVegan: false,
    isCrueltyFree: false,
    inStock: false,
  });

  // UI state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state when URL params change (e.g. from Navbar clicks)
  useEffect(() => {
    const urlCat = searchParams.get('category') || 'all';
    const urlSearch = searchParams.get('search') || '';
    const urlSort = searchParams.get('sort') || 'bestseller';
    setSelectedCategory(urlCat);
    setSearchTerm(urlSearch);
    setSortBy(urlSort);
  }, [searchParams]);

  // Load categories metadata
  useEffect(() => {
    async function loadCats() {
      const cats = await getCategories();
      setCategories(cats);
    }
    loadCats();
  }, []);

  // Fetch / filter products
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getProducts({
        category: selectedCategory,
        search: searchTerm,
        sort: sortBy,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 20000 ? priceRange[1] : undefined,
        isVegan: filters.isVegan,
        isCrueltyFree: filters.isCrueltyFree,
        inStock: filters.inStock,
      });
      setProducts(res.products || []);
      setLoading(false);
    }
    loadData();
  }, [selectedCategory, searchTerm, sortBy, priceRange, filters]);

  // Update URL params smoothly
  const updateUrlParams = (newCat, newSearch, newSort) => {
    const params = new URLSearchParams();
    if (newCat && newCat !== 'all') params.set('category', newCat);
    if (newSearch && newSearch.trim()) params.set('search', newSearch.trim());
    if (newSort && newSort !== 'bestseller') params.set('sort', newSort);
    setSearchParams(params, { replace: true });
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    updateUrlParams(cat, searchTerm, sortBy);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    updateUrlParams(selectedCategory, val, sortBy);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    updateUrlParams(selectedCategory, searchTerm, val);
  };

  const handleToggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('bestseller');
    setPriceRange([0, 20000]);
    setFilters({ isVegan: false, isCrueltyFree: false, inStock: false });
    setSearchParams({}, { replace: true });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product) => {
    showToast(`🌸 Added "${product.name}" to your shopping bag!`);
  };

  // Active filters list for chip display
  const activeChips = useMemo(() => {
    const list = [];
    if (selectedCategory !== 'all') {
      const catObj = categories.find(c => c.slug === selectedCategory);
      list.push({ key: 'cat', label: `Category: ${catObj ? catObj.name : selectedCategory}`, clear: () => handleSelectCategory('all') });
    }
    if (searchTerm.trim()) {
      list.push({ key: 'search', label: `Search: "${searchTerm}"`, clear: () => handleSearchChange('') });
    }
    if (priceRange[1] < 20000) {
      list.push({ key: 'price', label: `Under Rs. ${priceRange[1].toLocaleString()}`, clear: () => setPriceRange([0, 20000]) });
    }
    if (filters.isVegan) {
      list.push({ key: 'vegan', label: '🌱 Vegan', clear: () => handleToggleFilter('isVegan') });
    }
    if (filters.isCrueltyFree) {
      list.push({ key: 'cruelty', label: '🐰 Cruelty-Free', clear: () => handleToggleFilter('isCrueltyFree') });
    }
    if (filters.inStock) {
      list.push({ key: 'stock', label: '📦 In Stock', clear: () => handleToggleFilter('inStock') });
    }
    return list;
  }, [selectedCategory, searchTerm, priceRange, filters, categories]);

  const currentCategoryTitle = useMemo(() => {
    if (selectedCategory === 'all') return 'All Clean Beauty & Skincare';
    const found = categories.find(c => c.slug === selectedCategory);
    return found ? `${found.name} Collection` : 'Product Catalog';
  }, [selectedCategory, categories]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'rgba(23, 23, 27, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-accent-rose)',
            borderRadius: 'var(--radius-xl)',
            padding: '12px 20px',
            color: '#fff',
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideUp 0.3s ease',
          }}
        >
          <span>{toastMessage}</span>
          <Link to="/cart" style={{ color: 'var(--color-accent-rose)', textDecoration: 'underline', fontSize: 'var(--text-xs)' }}>
            View Bag
          </Link>
        </div>
      )}

      {/* Hero / Page Header */}
      <section style={{
        marginTop: 'var(--nav-height)',
        padding: 'var(--space-12) var(--space-10) var(--space-8)',
        background: 'linear-gradient(180deg, rgba(232, 114, 150, 0.08) 0%, rgba(13, 13, 15, 0) 100%)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
            <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to="/products" style={{ color: selectedCategory === 'all' ? 'var(--color-accent-rose)' : 'var(--color-text-muted)', textDecoration: 'none' }}>
              Shop
            </Link>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span style={{ color: 'var(--color-accent-rose)', textTransform: 'capitalize' }}>{selectedCategory}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
            <div>
              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: '800',
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
                margin: '0 0 var(--space-2) 0',
              }}>
                {currentCategoryTitle}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0, maxWidth: '600px' }}>
                Discover our curated lineup of science-backed botanical formulas. 100% cruelty-free, ethical, and tailored to empower your natural radiance.
              </p>
            </div>

            {/* Live Search Input in Header */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search serums, lipsticks, ingredients..."
                className="input"
                style={{
                  paddingLeft: '40px',
                  paddingRight: searchTerm ? '36px' : '16px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,255,255,0.05)',
                }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>
                🔍
              </span>
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Body */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--space-8) var(--space-10)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
          
          {/* Left Column: Filter Sidebar */}
          <ProductFilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            priceRange={priceRange}
            onChangePriceRange={setPriceRange}
            filters={filters}
            onToggleFilter={handleToggleFilter}
            onResetFilters={handleResetFilters}
            totalProductsCount={products.length}
          />

          {/* Right Column: Products & Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Action Bar: Counts, Chips, Sort & View Modes */}
            <div style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4) var(--space-6)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}>
              {/* Product Counter */}
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                Showing <strong style={{ color: 'var(--color-text-primary)' }}>{products.length}</strong> clean beauty {products.length === 1 ? 'product' : 'products'}
              </div>

              {/* Controls: Sort Dropdown + View Mode */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                {/* Sort By Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <label htmlFor="sort-select" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Sort:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={e => handleSortChange(e.target.value)}
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '6px 12px',
                      fontSize: 'var(--text-xs)',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="bestseller">⭐ Best Sellers</option>
                    <option value="rating-desc">★ Highest Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Product Name: A - Z</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                    style={{
                      background: viewMode === 'grid' ? 'rgba(184, 169, 217, 0.2)' : 'transparent',
                      border: 'none',
                      color: viewMode === 'grid' ? 'var(--color-accent-lavender)' : 'var(--color-text-muted)',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    ▦
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    title="List View"
                    style={{
                      background: viewMode === 'list' ? 'rgba(184, 169, 217, 0.2)' : 'transparent',
                      border: 'none',
                      color: viewMode === 'list' ? 'var(--color-accent-lavender)' : 'var(--color-text-muted)',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips Bar */}
            {activeChips.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Active filters:</span>
                {activeChips.map(chip => (
                  <span
                    key={chip.key}
                    style={{
                      background: 'rgba(232, 114, 150, 0.15)',
                      border: '1px solid var(--color-accent-rose)',
                      borderRadius: 'var(--radius-full)',
                      padding: '3px 12px',
                      fontSize: '11px',
                      color: 'var(--color-text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {chip.label}
                    <button
                      onClick={chip.clear}
                      style={{ background: 'none', border: 'none', color: 'var(--color-accent-rose)', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleResetFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid or Empty State */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ fontSize: '2.5rem', animation: 'spin 2s linear infinite' }}>🌸</div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Loading clean beauty formulas...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--space-12) var(--space-8)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-4)',
              }}>
                <div style={{ fontSize: '3rem' }}>🔍</div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  No Products Found
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '420px', margin: 0 }}>
                  We couldn't find any products matching your current filters. Try changing your search query or reset the filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-primary btn-pill btn-sm"
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  Reset All Filters 🌸
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 'var(--space-6)',
              }}>
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode="grid"
                    onQuickView={p => setQuickViewProduct(p)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode="list"
                    onQuickView={p => setQuickViewProduct(p)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <Footer />
    </div>
  );
}
