import { getCustomers, useQuery } from "wasp/client/operations";
import { InnerLayout } from "../layout/InnerLayout";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { Modal } from "../components/Modal/Modal";
import AddReview from "../assets/svg/AddReview";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import ReviewModal from "../components/ReviewModal";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineRateReview,
} from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { FilterModal } from "../components/Modal/FilterModal";
import { getPaginatedData } from "../utils/Functions";
import { useAuth } from "wasp/client/auth";
import CustomerModal from "../components/Modal/CustomerModal";
import RightLogo from "../assets/svg/RightLogo";

export const CustomersPage = () => {
  const { data: user } = useAuth();
  if (!user.organizationId) {
    return (
      <InnerLayout childHeader="Customers" ChildIcon={FaUser}>
        <div>Error: Could not load the current resource!</div>
      </InnerLayout>
    );
  }
  const { data: customers, isLoading, isError } = useQuery(getCustomers);
  const [allChecked, setAllChecked] = useState(false);
  const [singleChecked, setSingleChecked] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [imporModal, setImportModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState("Schedule Review");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const openModal = () => setFilterModal(true);
  const closeModal = () => setFilterModal(false);

  if (isLoading) {
    return (
      <>
        <InnerLayout childHeader="Customers" ChildIcon={FaUser}>
          <div>Loading customers...</div>
        </InnerLayout>
      </>
    );
  }

  if (isError)
    return (
      <InnerLayout childHeader="Customers" ChildIcon={FaUser}>
        <div>Error loading customers</div>
      </InnerLayout>
    );

  // Sync individual checkbox states with allChecked
  const handleAllChecked = () => {
    const newChecked = !allChecked;
    setAllChecked(newChecked);
    setSingleChecked(
      customers.map((customer) => ({
        customerId: customer.id,
        isChecked: newChecked,
      }))
    );
  };

  const { paginatedData, totalPages, hasNextPage, hasPreviousPage } =
    getPaginatedData(customers || [], currentPage, itemsPerPage);

  // Toggle a single checkbox
  const handleSingleChecked = (customerId) => {
    setSingleChecked((prevChecked) => {
      console.log(prevChecked);
      const newChecked = prevChecked.map((item) =>
        item.customerId === customerId
          ? { ...item, isChecked: !item.isChecked }
          : item
      );

      setAllChecked(newChecked.every((item) => item.isChecked)); // Update allChecked state
      return newChecked;
    });
  };

  const handleImport = () => {
    setImportModal(!imporModal);
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
    if (direction === "prev" && hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const resetModal = () => {
    setImportModal(false);
    setModalOpen(false);
    setModalHeader("Schedule Review");
    setFilterModal(false);
  };

  return (
    <>
      <InnerLayout childHeader="Customers" ChildIcon={FaUser}>
        <div className="w-full max-w-[75rem] mx-auto h-full flex flex-col justify-start items-center gap-4 static">
          {customers && customers.length > 0 ? (
            <>
              <div className="w-full py-3 px-5 absolute top-0 left-0 flex items-center justify-start gap-6 bg-body border-b">
                <button
                  type="button"
                  onClick={handleImport}
                  className="btn btn-primary flex"
                  title="Add Customer"
                >
                  <FaUserPlus size={20} /> Import
                </button>
                {allChecked && (
                  <button
                    type="button"
                    className="btn dlt-btn !min-w-auto border flex items-center"
                  >
                    <FaRegTrashAlt size={16} /> Remove
                  </button>
                )}
              </div>

              <div className="lg:mt-[7rem] mt-10 flex flex-col w-full dash-card rounded-md border">
                <div className="w-full page-count px-5 py-6 border-b">
                  <p className="text-left">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
                <div className="w-full p-6">
                  <div className="customer-list w-full overflow-x-auto border">
                    <table className="w-full rounded-lg">
                      <thead>
                        <tr>
                          <th width="50" className="px-4 py-2 text-left">
                            <input
                              type="checkbox"
                              onChange={handleAllChecked}
                              checked={allChecked}
                              className="form-checkbox text-blue-500 cursor-pointer"
                            />
                          </th>
                          <th className="px-4 py-4 text-left">Name</th>
                          <th className="px-4 py-4 text-left">Email</th>
                          <th className="px-4 py-4 text-left">Phone</th>
                          <th className="px-4 py-4 text-left">Added On</th>
                          <th className="px-4 py-4 text-left">
                            Schedule Review
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData?.map((customer) => {
                          const checked = singleChecked.find(
                            (item) => item.customerId === customer.id
                          )?.isChecked;

                          return (
                            <tr key={customer.id}>
                              <td width="50" className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={checked || false}
                                  onChange={() =>
                                    handleSingleChecked(customer.id)
                                  }
                                  value={customer.id}
                                  className="form-checkbox text-blue-500 cursor-pointer"
                                />
                              </td>
                              <td width="300" className="px-4 py-3">
                                {customer?.firstName &&
                                  customer?.lastName &&
                                  `${customer.firstName} ${customer.lastName}`}
                              </td>
                              <td width="300" className="px-4 py-3">
                                {customer.email}
                              </td>
                              <td width="300" className="px-4 py-3">
                                {customer.phone}
                              </td>
                              <td width="300" className="px-4 py-3">
                                2024-11-25
                              </td>
                              <td width="300" className="px-4 py-3 text-right">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => setModalOpen(true)}
                                >
                                  Request Review
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pagination-controls w-full flex items-center justify-end mt-4 gap-3">
                
                <div className="w-full flex items-center px-3 py-3 max-w-[5.625rem] justify-between rounded-md border ">
                  <button
                    className={` min-h-fit ${
                      currentPage === 1 ? "" : "cursor-pointer"
                    }  `}
                    onClick={() => handlePageChange("prev")}
                    disabled={!hasPreviousPage}
                  >
                    <span className=" rotate-90 ">
                      <RightLogo />
                    </span>
                  </button>
                  <button
                    className={` min-h-fit  `}
                    onClick={() => handlePageChange("next")}
                    disabled={!hasNextPage}
                  >
                    <span className=" rotate-[-90deg] ">
                      {" "}
                      <RightLogo />{" "}
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-[30px] items-center relative top-[50%] translate-y-[-50%]">
              <div className="flex flex-col items-center">
                <AddReview className="w-[200px] h-[200px]" />
                <h2 className="h5 font-bold mt-3">No Customers</h2>
                <p className="p mt-3 text-center">
                  Connect a CRM or add customers to start <br /> requesting
                  reviews.
                </p>
              </div>
              <div className="w-full flex items-center justify-center">
                <button
                  type="button"
                  className="flex btn btn-primary border"
                  onClick={handleImport}
                >
                  Import customers
                </button>
              </div>
            </div>
          )}

          <Modal
            isOpen={imporModal}
            onClose={resetModal}
            modalHeader="Import Customers"
            className="loc_page"
          >
            <CustomerModal
              className="customer-modal"
              organizationId={user.organizationId}
            />
          </Modal>

          <Modal
            isOpen={modalOpen}
            onClose={resetModal}
            modalHeader={modalHeader}
            className="loc_page"
          >
            <ReviewModal className="customer-modal" />
          </Modal>
        </div>
      </InnerLayout>
    </>
  );
};
