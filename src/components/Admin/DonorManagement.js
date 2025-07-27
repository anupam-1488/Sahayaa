// src/components/Admin/DonorManagement.js
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, IndianRupee, Calendar, 
  Users, TrendingUp, Award, BarChart3, Mail, Phone,
  FileText, CheckCircle, AlertCircle, Zap
} from 'lucide-react';
import { db } from '../../config/supabase';

const DonorManagement = ({ user }) => {
  const [donations, setDonations] = useState([]);
  const [donationStats, setDonationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCause, setFilterCause] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [donationsPerPage] = useState(20);

  useEffect(() => {
    if (user) {
      loadDonationData();
    }
  }, [user]);

  const loadDonationData = async () => {
    setLoading(true);
    try {
      const [donationsResult, statsResult] = await Promise.all([
        db.getDonations(),
        db.getDonationStats()
      ]);

      if (donationsResult.data) {
        setDonations(donationsResult.data);
      }

      if (statsResult.data) {
        setDonationStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error loading donation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await db.searchDonations(searchTerm, filterCause, filterDateFrom, filterDateTo);
      if (result.data) {
        setDonations(result.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCause('');
    setFilterDateFrom('');
    setFilterDateTo('');
    loadDonationData();
  };

  const exportDonations = () => {
    const csvContent = generateCSV(donations);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donations-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = (data) => {
    const headers = [
      'Donation ID', 'Date', 'Donor Name', 'Email', 'Phone', 
      'Amount', 'Cause', 'Payment Method', 'Status', 'Anonymous'
    ];
    
    const rows = data.map(donation => [
      donation.donation_id,
      new Date(donation.created_at).toLocaleDateString(),
      donation.donor_name,
      donation.donor_email,
      donation.donor_phone,
      donation.amount,
      donation.cause,
      donation.payment_method || 'Online',
      donation.payment_status,
      donation.is_anonymous ? 'Yes' : 'No'
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // Pagination
  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = donations.slice(indexOfFirstDonation, indexOfLastDonation);
  const totalPages = Math.ceil(donations.length / donationsPerPage);

  if (!user) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h3>
        <p className="text-gray-600">You need to be logged in as an admin to view donor management.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />
      
      {donationStats && <StatsOverview stats={donationStats} />}
      
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCause={filterCause}
        setFilterCause={setFilterCause}
        filterDateFrom={filterDateFrom}
        setFilterDateFrom={setFilterDateFrom}
        filterDateTo={filterDateTo}
        setFilterDateTo={setFilterDateTo}
        onSearch={handleSearch}
        onReset={resetFilters}
        onExport={exportDonations}
      />

      <DonationsTable 
        donations={currentDonations}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        donationsPerPage={donationsPerPage}
        totalDonations={donations.length}
      />
    </div>
  );
};

const DashboardHeader = () => (
  <div className="text-center">
    <h1 className="text-4xl font-bold text-green-800 mb-4">Donor Management</h1>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
      Track donations, manage donor relationships, and generate reports for Sahayaa Trust.
    </p>
  </div>
);

const StatsOverview = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <StatCard
      icon={IndianRupee}
      value={`₹${stats.totalAmount.toLocaleString('en-IN')}`}
      label="Total Raised"
      color="green"
      subtitle={`${stats.totalDonations} donations`}
    />
    <StatCard
      icon={Users}
      value={stats.uniqueDonors}
      label="Unique Donors"
      color="blue"
      subtitle={`Avg: ₹${stats.averageDonation.toLocaleString('en-IN')}`}
    />
    <StatCard
      icon={TrendingUp}
      value={stats.monthlyTrend.length > 0 ? `₹${stats.monthlyTrend[stats.monthlyTrend.length - 1]?.amount.toLocaleString('en-IN') || 0}` : '₹0'}
      label="This Month"
      color="purple"
      subtitle="Current month"
    />
    <StatCard
      icon={Award}
      value={stats.topCauses.length > 0 ? stats.topCauses[0]?.cause : 'N/A'}
      label="Top Cause"
      color="orange"
      subtitle={stats.topCauses.length > 0 ? `${stats.topCauses[0]?.count} donations` : ''}
    />
  </div>
);

const StatCard = ({ icon: Icon, value, label, color, subtitle }) => {
  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className={`w-12 h-12 ${colors[color]} rounded-full flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-gray-600 font-medium">{label}</div>
      {subtitle && <div className="text-gray-500 text-sm mt-1">{subtitle}</div>}
    </div>
  );
};

const SearchAndFilters = ({
  searchTerm, setSearchTerm, filterCause, setFilterCause,
  filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo,
  onSearch, onReset, onExport
}) => {
  const causes = ['general', 'education', 'healthcare', 'community', 'nutrition', 'emergency'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Search & Filter Donations</h3>
        <button
          onClick={onExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search donations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Cause Filter */}
        <div className="relative">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterCause}
            onChange={(e) => setFilterCause(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Causes</option>
            {causes.map(cause => (
              <option key={cause} value={cause}>
                {cause.charAt(0).toUpperCase() + cause.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="relative">
          <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Date To */}
        <div className="relative">
          <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={onSearch}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            onClick={onReset}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const DonationsTable = ({ 
  donations, currentPage, totalPages, setCurrentPage, 
  donationsPerPage, totalDonations 
}) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Donations ({totalDonations})
        </h3>
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Donation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Donor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cause
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {donations.map((donation) => (
            <DonationRow key={donation.id} donation={donation} />
          ))}
        </tbody>
      </table>
    </div>

    {totalPages > 1 && (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    )}
  </div>
);

const DonationRow = ({ donation }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div>
        <div className="text-sm font-medium text-gray-900">
          {donation.donation_id}
        </div>
        <div className="text-sm text-gray-500">
          {donation.razorpay_payment_id?.slice(-8)}
        </div>
      </div>
    </td>
    
    <td className="px-6 py-4 whitespace-nowrap">
      <div>
        <div className="text-sm font-medium text-gray-900">
          {donation.is_anonymous ? 'Anonymous' : donation.donor_name}
        </div>
        {!donation.is_anonymous && (
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <Mail className="w-3 h-3" />
            <span>{donation.donor_email}</span>
          </div>
        )}
      </div>
    </td>
    
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-bold text-green-600">
        ₹{parseFloat(donation.amount).toLocaleString('en-IN')}
      </div>
      <div className="text-xs text-gray-500">
        Tax: ₹{Math.floor(donation.amount * 0.5).toLocaleString('en-IN')}
      </div>
    </td>
    
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        {donation.cause}
      </span>
    </td>
    
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(donation.created_at).toLocaleDateString('en-IN')}
    </td>
    
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={donation.payment_status} />
    </td>
    
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
      <button className="text-blue-600 hover:text-blue-900">
        <Eye className="w-4 h-4" />
      </button>
      <button className="text-green-600 hover:text-green-900">
        <FileText className="w-4 h-4" />
      </button>
      <button className="text-purple-600 hover:text-purple-900">
        <Mail className="w-4 h-4" />
      </button>
    </td>
  </tr>
);

const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Zap className="w-3 h-3" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(status)}`}>
      {getStatusIcon(status)}
      <span>{status}</span>
    </span>
  );
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
    <button
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    
    <div className="flex space-x-2">
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const page = i + Math.max(1, currentPage - 2);
        return page <= totalPages ? (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              currentPage === page
                ? 'bg-green-600 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ) : null;
      })}
    </div>
    
    <button
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
);

const LoadingState = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DonorManagement;