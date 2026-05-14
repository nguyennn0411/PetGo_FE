import React, { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  Heart,
  Info,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  Menu,
  Navigation,
  PawPrint,
  Search,
  SlidersHorizontal,
  Star,
  User,
  X,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getProviderFilterOptions, searchProviders } from '../api/providers';
import {
  buildProviderAddress,
  formatCurrencyVnd,
  loadFavoriteProviderIds,
  mapTimeOfDayLabel,
  pickProviderImage,
  toggleFavoriteProviderId,
} from '../utils/providerHelpers';

const DEFAULT_FILTERS = {
  query: '',
  city: '',
  serviceCategoryIds: [],
  minPrice: '',
  maxPrice: '',
  minRating: '',
  maxDistanceKm: '',
  timeOfDay: '',
  sortBy: 'FEATURED',
  featuredOnly: false,
};

const SearchFilterPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState({ items: [], totalItems: 0, page: 0, size: 12, hasNext: false, filterOptions: null });
  const [filterOptions, setFilterOptions] = useState({ serviceCategories: [], cities: [], sortOptions: [], timeOfDayOptions: [] });
  const [favorites, setFavorites] = useState(loadFavoriteProviderIds());
  const [location, setLocation] = useState({ latitude: '', longitude: '', enabled: false, loading: false, label: 'Chưa lấy vị trí' });

  const getInitialFilters = () => {
    const categoryFromUrl = searchParams.get('categoryId') || searchParams.get('category');
    const categoriesCsv = searchParams.get('serviceCategoryIds') || searchParams.get('serviceCategorySlugs');
    const serviceCategoryIds = categoriesCsv
      ? categoriesCsv.split(',').filter(Boolean)
      : categoryFromUrl
        ? [categoryFromUrl]
        : [];

    return {
      query: searchParams.get('query') || searchParams.get('q') || '',
      city: searchParams.get('city') || '',
      serviceCategoryIds,
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minRating: searchParams.get('minRating') || '',
      maxDistanceKm: searchParams.get('maxDistanceKm') || '',
      timeOfDay: searchParams.get('timeOfDay') || '',
      sortBy: searchParams.get('sortBy') || 'FEATURED',
      featuredOnly: searchParams.get('featuredOnly') === 'true',
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await getProviderFilterOptions();
        setFilterOptions(data || { serviceCategories: [], cities: [], sortOptions: [], timeOfDayOptions: [] });
      } catch {
        setFilterOptions({ serviceCategories: [], cities: [], sortOptions: [], timeOfDayOptions: [] });
      }
    };

    loadOptions();
  }, []);

  const buildParams = (page = 0) => ({
    query: filters.query || undefined,
    city: filters.city || undefined,
    serviceCategoryIds: filters.serviceCategoryIds.length ? filters.serviceCategoryIds.join(',') : undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    minRating: filters.minRating || undefined,
    maxDistanceKm: filters.maxDistanceKm || undefined,
    timeOfDay: filters.timeOfDay || undefined,
    sortBy: filters.sortBy || 'FEATURED',
    featuredOnly: filters.featuredOnly || undefined,
    latitude: location.enabled && location.latitude ? location.latitude : undefined,
    longitude: location.enabled && location.longitude ? location.longitude : undefined,
    page,
    size: 12,
  });

  const syncSearchParams = () => {
    const params = new URLSearchParams();
    if (filters.query) params.set('query', filters.query);
    if (filters.city) params.set('city', filters.city);
    if (filters.serviceCategoryIds.length) params.set('serviceCategoryIds', filters.serviceCategoryIds.join(','));
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.maxDistanceKm) params.set('maxDistanceKm', filters.maxDistanceKm);
    if (filters.timeOfDay) params.set('timeOfDay', filters.timeOfDay);
    if (filters.sortBy && filters.sortBy !== 'FEATURED') params.set('sortBy', filters.sortBy);
    if (filters.featuredOnly) params.set('featuredOnly', 'true');
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  };

  const fetchResults = async (page = 0, append = false) => {
    setLoading(true);
    setError('');
    try {
      const data = await searchProviders(buildParams(page));
      setResult((prev) => ({
        ...data,
        items: append ? [...(prev.items || []), ...(data?.items || [])] : data?.items || [],
      }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Không tìm thấy dữ liệu phù hợp.');
      if (!append) {
        setResult({ items: [], totalItems: 0, page: 0, size: 12, hasNext: false, filterOptions: null });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncSearchParams();
    const timer = setTimeout(() => {
      fetchResults(0, false);
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, location.latitude, location.longitude, location.enabled]);

  const handleCategoryChange = (categoryId) => {
    const value = String(categoryId);
    setFilters((prev) => ({
      ...prev,
      serviceCategoryIds: prev.serviceCategoryIds.includes(value)
        ? prev.serviceCategoryIds.filter((item) => item !== value)
        : [...prev.serviceCategoryIds, value],
    }));
  };

  const handleToggleFavorite = (providerId) => {
    setFavorites(toggleFavoriteProviderId(providerId));
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, enabled: false, label: 'Trình duyệt không hỗ trợ GPS' }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, label: 'Đang lấy vị trí...' }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          enabled: true,
          loading: false,
          label: 'Đã dùng vị trí hiện tại',
        });
      },
      () => {
        setLocation((prev) => ({ ...prev, enabled: false, loading: false, label: 'Không lấy được vị trí' }));
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setLocation((prev) => ({ ...prev, enabled: false, label: 'Đã tắt vị trí' }));
  };

  const headerStats = useMemo(() => {
    const appliedCategories = filters.serviceCategoryIds.length;
    const appliedExtras = [filters.city, filters.minPrice, filters.maxPrice, filters.minRating, filters.maxDistanceKm, filters.timeOfDay]
      .filter(Boolean).length;
    return appliedCategories + appliedExtras + (filters.featuredOnly ? 1 : 0);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-orange-500 p-2 rounded-xl">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              Pet<span className="text-orange-500">Go</span>
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-500">
            <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <Link to="/search" className="text-orange-600">Services</Link>
            <Link to="/providers" className="hover:text-orange-600 transition-colors">Providers</Link>
            <Link to="/nearby" className="hover:text-orange-600 transition-colors">Nearby</Link>
            <div
              className="w-9 h-9 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <User className="w-4 h-4 text-orange-600" />
            </div>
          </nav>

          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium text-gray-600">
            <Link to="/">Home</Link>
            <Link to="/providers">Providers</Link>
            <Link to="/nearby">Nearby</Link>
          </div>
        )}
      </header>

      <section className="bg-white border-b border-gray-100 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 tracking-tight">
            Tìm dịch vụ hoàn hảo cho thú cưng
          </h1>
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
              placeholder="Search by provider name or service"
              className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[2.5rem] text-lg font-bold focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all outline-none shadow-inner"
            />
            {loading && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <button
              onClick={requestLocation}
              disabled={location.loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 disabled:opacity-60"
            >
              <Navigation className="w-4 h-4" /> {location.loading ? 'Đang lấy vị trí...' : 'Dùng vị trí hiện tại'}
            </button>
            <button
              onClick={() => navigate('/nearby')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100"
            >
              <MapPin className="w-4 h-4" /> Xem gần bạn
            </button>
            <span className="text-gray-500 font-medium">{location.label}</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-80 shrink-0 space-y-8">
            <div className="flex items-center justify-between lg:justify-start gap-2 mb-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" /> Bộ lọc nâng cao
              </h3>
              <button className="text-xs font-bold text-orange-600" onClick={clearFilters}>
                Xóa tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <FilterGroup label="Vị trí">
                <select
                  value={filters.city}
                  onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 shadow-sm"
                >
                  <option value="">Tất cả khu vực</option>
                  {(filterOptions.cities || []).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="Loại dịch vụ">
                <div className="space-y-3 max-h-56 overflow-auto pr-1">
                  {(filterOptions.serviceCategories || []).map((item) => (
                    <CategoryFilterNode
                      key={item.id}
                      category={item}
                      selectedIds={filters.serviceCategoryIds}
                      onChange={handleCategoryChange}
                    />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Khoảng giá">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                    placeholder="Min"
                    className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none"
                  />
                  <div className="w-2 h-0.5 bg-gray-200"></div>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                    placeholder="Max"
                    className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </FilterGroup>

              <FilterGroup label="Đánh giá">
                {[5, 4, 3].map((star) => (
                  <label key={star} className="flex items-center gap-3 cursor-pointer mb-3 last:mb-0 group">
                    <input
                      type="radio"
                      name="rating"
                      checked={String(filters.minRating) === String(star)}
                      onChange={() => setFilters((prev) => ({ ...prev, minRating: String(star) }))}
                      className="w-4 h-4 text-orange-500 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900">{star}.0 trở lên</span>
                    </div>
                  </label>
                ))}
                <button className="text-xs font-semibold text-orange-600" onClick={() => setFilters((prev) => ({ ...prev, minRating: '' }))}>
                  Bỏ lọc đánh giá
                </button>
              </FilterGroup>

              <FilterGroup label="Khoảng cách">
                <select
                  value={filters.maxDistanceKm}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxDistanceKm: e.target.value }))}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none"
                >
                  <option value="">Không giới hạn</option>
                  <option value="2">Dưới 2 km</option>
                  <option value="5">Dưới 5 km</option>
                  <option value="10">Dưới 10 km</option>
                </select>
              </FilterGroup>

              <FilterGroup label="Khung giờ còn trống">
                <div className="flex flex-wrap gap-2">
                  {(filterOptions.timeOfDayOptions || []).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, timeOfDay: prev.timeOfDay === value ? '' : value }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${filters.timeOfDay === value
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-gray-50 border-transparent hover:border-orange-200 hover:bg-white'
                        }`}
                    >
                      {mapTimeOfDayLabel(value)}
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Khác">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.featuredOnly}
                    onChange={(e) => setFilters((prev) => ({ ...prev, featuredOnly: e.target.checked }))}
                    className="w-5 h-5 rounded-lg border-2 border-gray-200 text-orange-500 focus:ring-0 cursor-pointer transition-all"
                  />
                  <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                    Chỉ nhà cung cấp nổi bật
                  </span>
                </label>
              </FilterGroup>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {result.totalItems > 0 ? `${result.totalItems} kết quả phù hợp` : 'Kết quả tìm kiếm'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Đang áp dụng {headerStats} bộ lọc {location.enabled ? 'và vị trí hiện tại' : ''}.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex bg-white border rounded-2xl p-1">
                  <button
                    onClick={() => setLayout('grid')}
                    className={`p-2 rounded-xl ${layout === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayout('list')}
                    className={`p-2 rounded-xl ${layout === 'list' ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                  className="px-4 py-3 bg-white border rounded-2xl text-sm font-bold outline-none"
                >
                  {(filterOptions.sortOptions || ['FEATURED', 'NEAREST', 'TOP_RATED', 'LOWEST_PRICE']).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
                {error}
              </div>
            )}

            {loading && result.items.length === 0 ? (
              <div className="py-20 flex items-center justify-center gap-3 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" /> Đang tìm kiếm...
              </div>
            ) : result.items.length === 0 ? (
              <div className="bg-white rounded-3xl border p-10 text-center text-gray-500">
                Không có nhà cung cấp phù hợp với bộ lọc này.
              </div>
            ) : (
              <>
                <div className={layout === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-6' : 'space-y-5'}>
                  {result.items.map((provider) => (
                    <ProviderResultCard
                      key={provider.id}
                      provider={provider}
                      layout={layout}
                      isFavorite={favorites.includes(provider.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {result.hasNext && (
                    <button
                      disabled={loading}
                      onClick={() => fetchResults((result.page || 0) + 1, true)}
                      className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-orange-500 disabled:opacity-60"
                    >
                      {loading ? 'Đang tải...' : 'Xem thêm'}
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/compare')}
                    className="px-6 py-3 rounded-2xl border bg-white font-semibold hover:bg-gray-50"
                  >
                    So sánh nhà cung cấp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const FilterGroup = ({ label, children }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">{label}</h3>
      <Info className="w-4 h-4 text-gray-300" />
    </div>
    {children}
  </div>
);

const CategoryFilterNode = ({ category, selectedIds, onChange, level = 0 }) => {
  const value = String(category.id);
  const children = Array.isArray(category.children) ? category.children : [];

  return (
    <div>
      <label className="flex items-center gap-3 cursor-pointer group" style={{ paddingLeft: level * 16 }}>
        <input
          type="checkbox"
          checked={selectedIds.includes(value)}
          onChange={() => onChange(value)}
          className="w-5 h-5 rounded-lg border-2 border-gray-200 text-orange-500 focus:ring-0 cursor-pointer transition-all"
        />
        <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
          {category.name}
        </span>
      </label>
      {children.length > 0 && (
        <div className="mt-2 space-y-2 border-l border-dashed border-gray-200 ml-2 pl-2">
          {children.map((child) => (
            <CategoryFilterNode
              key={child.id}
              category={child}
              selectedIds={selectedIds}
              onChange={onChange}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProviderResultCard = ({ provider, layout, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const cardLayoutClass = layout === 'grid'
    ? 'bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden'
    : 'bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row';

  return (
    <div className={cardLayoutClass}>
      <div className={layout === 'grid' ? 'relative' : 'relative md:w-72 shrink-0'}>
        <img
          src={pickProviderImage(provider)}
          alt={provider.name}
          className={layout === 'grid' ? 'w-full h-56 object-cover' : 'w-full h-56 md:h-full object-cover'}
        />
        <button
          onClick={() => onToggleFavorite(provider.id)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-sm"
        >
          <Heart className={isFavorite ? 'w-4 h-4 text-red-500 fill-red-500' : 'w-4 h-4 text-gray-500'} />
        </button>
      </div>

      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-black text-xl text-gray-900 leading-tight">{provider.name}</h3>
            <p className="text-sm font-semibold text-orange-600 mt-1">{provider.featuredService || provider.headline || 'Dịch vụ nổi bật'}</p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-bold shrink-0">
            <Star className="w-4 h-4 fill-current" />
            {provider.rating || '0.0'}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
            <span>{buildProviderAddress(provider)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-400" />
            <span>{provider.distance || 'Chưa có khoảng cách'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${provider.openNow ? 'text-green-500' : 'text-gray-300'}`} />
            <span>{provider.openNow ? 'Đang mở cửa' : 'Ngoài giờ hoạt động'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex w-2.5 h-2.5 rounded-full ${provider.instantBooking ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            <span>{provider.instantBooking ? 'Đặt nhanh' : 'Đặt lịch xác nhận'}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(provider.categorySlugs || []).map((item) => (
            <span key={item} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold uppercase">
              {item}
            </span>
          ))}
          {(provider.availableSlots || []).slice(0, 4).map((slot) => (
            <span key={slot} className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold">
              {slot}
            </span>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-black">Giá từ</p>
            <p className="text-2xl font-black text-gray-900">{formatCurrencyVnd(provider.priceFrom)}đ</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/booking?providerId=${provider.id}`)}
              className="px-4 py-2 rounded-2xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600"
            >
              Book now
            </button>
            <button
              onClick={() => navigate(`/providers/${provider.id}`)}
              className="px-4 py-2 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterPage;
