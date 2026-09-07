import { useEffect, useMemo, useState } from "react";

import {
  BriefcaseBusiness,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  IndianRupee,
  Plus,
  X,
} from "lucide-react";

import {
  getAllDeals,
  updateDealStatus,
} from "../../api/dealApi";

import {
  getAllLeads,
} from "../../api/leadApi";

import api from "../../api/axios";


function DealsManagement() {
  // ==========================================
  // DEAL STATES
  // ==========================================

  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);

  // ==========================================
  // LEAD STATES
  // ==========================================

  const [closedLeads, setClosedLeads] = useState([]);

  // ==========================================
  // SEARCH / FILTER
  // ==========================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ==========================================
  // UI STATES
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // CREATE DEAL FORM
  // ==========================================

  const [formData, setFormData] = useState({
    leadId: "",
    dealAmount: "",
    commissionPercentage: "2",
  });

  const [createLoading, setCreateLoading] =
    useState(false);


  // ==========================================
  // FETCH DEALS
  // ==========================================

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllDeals();

      const dealList =
        Array.isArray(data) ? data : [];

      setDeals(dealList);
      setFilteredDeals(dealList);

    } catch (err) {
      console.error(
        "Deals error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load deals."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // FETCH CLOSED LEADS
  // ==========================================

  const fetchClosedLeads = async () => {
    try {
      setLeadsLoading(true);
      setError("");

      const data = await getAllLeads();

      const leads =
        Array.isArray(data) ? data : [];

      // Only CLOSED leads
      const closed = leads.filter(
        (lead) =>
          lead.status === "CLOSED"
      );

      // Remove leads that already have deals
      const existingLeadIds = new Set(
        deals.map(
          (deal) => String(deal.leadId)
        )
      );

      const availableClosedLeads =
        closed.filter(
          (lead) =>
            !existingLeadIds.has(
              String(lead.id)
            )
        );

      setClosedLeads(
        availableClosedLeads
      );

    } catch (err) {
      console.error(
        "Closed leads error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load closed leads."
      );

    } finally {
      setLeadsLoading(false);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchDeals();
  }, []);


  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  useEffect(() => {
    const value =
      search
        .toLowerCase()
        .trim();

    const result =
      deals.filter((deal) => {

        const matchesSearch =
          !value ||
          String(
            deal.propertyTitle || ""
          )
            .toLowerCase()
            .includes(value) ||

          String(
            deal.id || ""
          )
            .toLowerCase()
            .includes(value) ||

          String(
            deal.leadId || ""
          )
            .toLowerCase()
            .includes(value) ||

          String(
            deal.propertyId || ""
          )
            .toLowerCase()
            .includes(value);

        const matchesStatus =
          statusFilter === "ALL" ||
          deal.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      });

    setFilteredDeals(result);

  }, [
    search,
    statusFilter,
    deals,
  ]);


  // ==========================================
  // OPEN CREATE DEAL MODAL
  // ==========================================

  const openCreateModal = async () => {
    setError("");
    setSuccess("");

    setFormData({
      leadId: "",
      dealAmount: "",
      commissionPercentage: "2",
    });

    setShowCreateModal(true);

    await fetchClosedLeads();
  };


  // ==========================================
  // CLOSE CREATE MODAL
  // ==========================================

  const closeCreateModal = () => {
    if (createLoading) {
      return;
    }

    setShowCreateModal(false);

    setFormData({
      leadId: "",
      dealAmount: "",
      commissionPercentage: "2",
    });
  };


  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleFormChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==========================================
  // CREATE DEAL
  // ==========================================

  const handleCreateDeal = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    // ========================================
    // VALIDATION
    // ========================================

    if (!formData.leadId) {
      setError(
        "Please select a closed lead."
      );
      return;
    }

    if (
      !formData.dealAmount ||
      Number(formData.dealAmount) <= 0
    ) {
      setError(
        "Deal amount must be greater than 0."
      );
      return;
    }

    if (
      !formData.commissionPercentage ||
      Number(
        formData.commissionPercentage
      ) <= 0
    ) {
      setError(
        "Commission percentage must be greater than 0."
      );
      return;
    }

    if (
      Number(
        formData.commissionPercentage
      ) > 100
    ) {
      setError(
        "Commission percentage cannot exceed 100."
      );
      return;
    }


    // ========================================
    // CREATE
    // ========================================

    try {
      setCreateLoading(true);

      const payload = {
        leadId: Number(
          formData.leadId
        ),
        dealAmount: Number(
          formData.dealAmount
        ),
        commissionPercentage:
          Number(
            formData.commissionPercentage
          ),
      };

      const response =
        await api.post(
          "/deals",
          payload
        );

      const createdDeal =
        response.data;


      // Add to deal list immediately
      setDeals((prev) => [
        createdDeal,
        ...prev,
      ]);

      setSuccess(
        "Deal created successfully."
      );

      closeCreateModal();

    } catch (err) {
      console.error(
        "Create deal error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create deal."
      );

    } finally {
      setCreateLoading(false);
    }
  };


  // ==========================================
  // UPDATE DEAL STATUS
  // ==========================================

  const handleStatusChange = async (
    dealId,
    status
  ) => {
    try {
      setActionLoading(dealId);
      setError("");
      setSuccess("");

      const updatedDeal =
        await updateDealStatus(
          dealId,
          status
        );

      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === dealId
            ? updatedDeal
            : deal
        )
      );

      setSuccess(
        "Deal status updated successfully."
      );

    } catch (err) {
      console.error(
        "Update deal status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update deal status."
      );

    } finally {
      setActionLoading(null);
    }
  };


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };


  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const formatStatus = (
    status
  ) => {
    if (!status) {
      return "UNKNOWN";
    }

    return status
      .replaceAll("_", " ");
  };


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (
    value
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₹0";
    }

    return `₹${Number(
      value
    ).toLocaleString("en-IN")}`;
  };


  // ==========================================
  // COMMISSION PREVIEW
  // ==========================================

  const commissionPreview =
    useMemo(() => {

      const amount =
        Number(
          formData.dealAmount
        );

      const percentage =
        Number(
          formData.commissionPercentage
        );

      if (
        !amount ||
        !percentage
      ) {
        return 0;
      }

      return (
        amount *
        percentage /
        100
      );

    }, [
      formData.dealAmount,
      formData.commissionPercentage,
    ]);


  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-medium text-slate-500">
              EstateHub Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Deals Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor deals, amounts, commissions and status.
            </p>

          </div>


          <div className="flex gap-3">

            {/* CREATE DEAL */}

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Create Deal
            </button>


            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchDeals}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

        </div>


        {/* ==========================================
            SUCCESS
        ========================================== */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* ==========================================
            SEARCH + FILTER
        ========================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search property, deal ID, lead ID..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-slate-500"
              />

            </div>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
            >

              <option value="ALL">
                All Statuses
              </option>

              <option value="PENDING">
                PENDING
              </option>

              <option value="COMPLETED">
                COMPLETED
              </option>

              <option value="CANCELLED">
                CANCELLED
              </option>

            </select>

          </div>

        </div>


        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <BriefcaseBusiness
                className="text-blue-600"
              />

              <div>

                <p className="text-sm text-slate-500">
                  Total Deals
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {deals.length}
                </p>

              </div>

            </div>

          </div>


          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <Clock className="text-yellow-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Pending
                </p>

                <p className="text-2xl font-bold text-yellow-600">
                  {
                    deals.filter(
                      (deal) =>
                        deal.status ===
                        "PENDING"
                    ).length
                  }
                </p>

              </div>

            </div>

          </div>


          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <CheckCircle className="text-green-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {
                    deals.filter(
                      (deal) =>
                        deal.status ===
                        "COMPLETED"
                    ).length
                  }
                </p>

              </div>

            </div>

          </div>


          {/* CANCELLED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <XCircle className="text-red-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Cancelled
                </p>

                <p className="text-2xl font-bold text-red-600">
                  {
                    deals.filter(
                      (deal) =>
                        deal.status ===
                        "CANCELLED"
                    ).length
                  }
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ==========================================
            DEAL CONTENT
        ========================================== */}

        {loading ? (

          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">

            <div className="text-center">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="text-sm text-slate-500">
                Loading deals...
              </p>

            </div>

          </div>

        ) : filteredDeals.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <BriefcaseBusiness
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-bold text-slate-900">
              No deals found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create a deal from a CLOSED lead.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Create Deal
            </button>

          </div>

        ) : (

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Deal
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Property
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Deal Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Commission %
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Commission
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {filteredDeals.map(
                    (deal) => (

                      <tr
                        key={deal.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* DEAL */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                              <BriefcaseBusiness
                                size={18}
                                className="text-slate-600"
                              />

                            </div>

                            <div>

                              <p className="font-semibold text-slate-900">
                                Deal #{deal.id}
                              </p>

                              <p className="text-xs text-slate-500">
                                Lead #{deal.leadId}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* PROPERTY */}

                        <td className="px-5 py-4">

                          <div>

                            <p className="max-w-[250px] truncate text-sm font-semibold text-slate-800">
                              {deal.propertyTitle ||
                                `Property #${deal.propertyId}`}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Property ID #
                              {deal.propertyId}
                            </p>

                          </div>

                        </td>


                        {/* DEAL AMOUNT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">

                            <IndianRupee size={15} />

                            {formatCurrency(
                              deal.dealAmount
                            ).replace(
                              "₹",
                              ""
                            )}

                          </div>

                        </td>


                        {/* COMMISSION % */}

                        <td className="px-5 py-4">

                          <span className="text-sm font-medium text-slate-700">
                            {
                              deal.commissionPercentage
                            }%
                          </span>

                        </td>


                        {/* COMMISSION */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1 text-sm font-semibold text-green-700">

                            <IndianRupee size={15} />

                            {formatCurrency(
                              deal.commissionAmount
                            ).replace(
                              "₹",
                              ""
                            )}

                          </div>

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              deal.status
                            )}`}
                          >
                            {
                              formatStatus(
                                deal.status
                              )
                            }
                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <select
                            value={
                              deal.status ||
                              ""
                            }
                            disabled={
                              actionLoading ===
                              deal.id
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                deal.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 disabled:opacity-50"
                          >

                            <option value="PENDING">
                              Pending
                            </option>

                            <option value="COMPLETED">
                              Completed
                            </option>

                            <option value="CANCELLED">
                              Cancelled
                            </option>

                          </select>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}


      </div>


      {/* ==========================================
          CREATE DEAL MODAL
      ========================================== */}

      {showCreateModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeCreateModal}
              disabled={createLoading}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            >
              <X size={18} />
            </button>


            {/* HEADER */}

            <div className="pr-10">

              <p className="text-sm font-medium text-slate-500">
                EstateHub Admin
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Create Deal
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create a deal from a closed buyer enquiry.
              </p>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleCreateDeal
              }
              className="mt-6 space-y-5"
            >

              {/* CLOSED LEAD */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Closed Lead
                </label>

                {leadsLoading ? (

                  <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    Loading closed leads...
                  </div>

                ) : closedLeads.length === 0 ? (

                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">

                    <p className="text-sm font-semibold text-yellow-800">
                      No available CLOSED leads
                    </p>

                    <p className="mt-1 text-xs leading-5 text-yellow-700">
                      Only closed leads without an existing deal can be selected.
                    </p>

                  </div>

                ) : (

                  <select
                    name="leadId"
                    value={
                      formData.leadId
                    }
                    onChange={
                      handleFormChange
                    }
                    disabled={
                      createLoading
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 disabled:bg-slate-100"
                  >

                    <option value="">
                      Select closed lead
                    </option>

                    {closedLeads.map(
                      (lead) => (
                        <option
                          key={
                            lead.id
                          }
                          value={
                            lead.id
                          }
                        >
                          Lead #{lead.id}
                          {lead.propertyTitle
                            ? ` - ${lead.propertyTitle}`
                            : lead.property?.title
                            ? ` - ${lead.property.title}`
                            : ""}
                        </option>
                      )
                    )}

                  </select>

                )}

              </div>


              {/* DEAL AMOUNT */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Deal Amount
                </label>

                <div className="relative">

                  <IndianRupee
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    name="dealAmount"
                    value={
                      formData.dealAmount
                    }
                    onChange={
                      handleFormChange
                    }
                    min="1"
                    step="0.01"
                    placeholder="e.g. 10000000"
                    disabled={
                      createLoading
                    }
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 disabled:bg-slate-100"
                  />

                </div>

              </div>


              {/* COMMISSION % */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Commission Percentage
                </label>

                <div className="relative">

                  <input
                    type="number"
                    name="commissionPercentage"
                    value={
                      formData.commissionPercentage
                    }
                    onChange={
                      handleFormChange
                    }
                    min="0.01"
                    max="100"
                    step="0.01"
                    placeholder="e.g. 2"
                    disabled={
                      createLoading
                    }
                    className="w-full rounded-xl border border-slate-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-500 disabled:bg-slate-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    %
                  </span>

                </div>

              </div>


              {/* COMMISSION PREVIEW */}

              <div className="rounded-2xl bg-slate-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Commission Preview
                  </span>

                  <span className="font-bold text-green-700">
                    {formatCurrency(
                      commissionPreview
                    )}
                  </span>

                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Final commission is calculated by the backend.
                </p>

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  disabled={
                    createLoading
                  }
                  className="flex-1 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    createLoading ||
                    closedLeads.length ===
                      0
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {createLoading ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create Deal
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default DealsManagement;