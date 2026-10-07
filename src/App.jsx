import { useState } from "react";
import "./App.css";

const orderStatuses = [
  "Created",
  "Processing",
  "Delivered",
];

const deliveryStatuses = [
  "Created",
  "In Transit",
  "Delivered",
];

function App() {
  const [module, setModule] = useState("OMS");

  return (
    <div className="app">
      <Sidebar
        module={module}
        setModule={setModule}
      />

      <div className="main">
        <Header module={module} />

        {module === "OMS" ? (
          <OMS />
        ) : (
          <DeliveryEngine />
        )}
      </div>
    </div>
  );
}

function Sidebar({ module, setModule }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">V</div>

        <div>
          <h2>Vendor CRM</h2>
          <p>Vendor Management</p>
        </div>
      </div>

      <div className="menu">
        <p className="menu-heading">MODULES</p>

        <button
          className={`menu-item ${
            module === "OMS" ? "active" : ""
          }`}
          onClick={() => setModule("OMS")}
        >
          OMS
        </button>

        <button
          className={`menu-item ${
            module === "DELIVERY" ? "active" : ""
          }`}
          onClick={() => setModule("DELIVERY")}
        >
          Delivery Engine
        </button>
      </div>

      <div className="sidebar-user">
        <div className="avatar">PR</div>

        <div>
          <strong>Priya Raghavan</strong>
          <p>Administrator</p>
        </div>
      </div>
    </aside>
  );
}

function Header({ module }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] =
    useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSearch = () => {
    setShowSearch(!showSearch);
    setShowNotifications(false);
    setShowProfile(false);
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowSearch(false);
    setShowProfile(false);
  };

  const handleProfile = () => {
    setShowProfile(!showProfile);
    setShowSearch(false);
    setShowNotifications(false);
  };

  return (
    <header className="header">
      <div>
        <p className="breadcrumb">
          Vendor CRM /{" "}
          {module === "OMS" ? "OMS" : "Delivery Engine"}
        </p>

        <h1>
          {module === "OMS"
            ? "Order Management System"
            : "Delivery Engine"}
        </h1>
      </div>

      <div className="header-right">
        <button
          className="header-button"
          onClick={handleSearch}
        >
          Search
        </button>

        <button
          className="header-button"
          onClick={handleNotifications}
        >
          Notifications
        </button>

        <div
          className="header-user"
          onClick={handleProfile}
        >
          <div className="avatar">PR</div>

          <div>
            <strong>Priya Raghavan</strong>
            <p>Administrator</p>
          </div>
        </div>

        {showSearch && (
          <div className="top-popup search-popup">
            <h3>Search</h3>

            <input
              type="text"
              placeholder="Search..."
              autoFocus
            />
          </div>
        )}

        {showNotifications && (
          <div className="top-popup notification-popup">
            <h3>Notifications</h3>

            <div className="notification-item">
              <span className="notification-dot"></span>
              <div>
                <strong>No new notifications</strong>
                <p>
                  You are all caught up.
                </p>
              </div>
            </div>
          </div>
        )}

        {showProfile && (
          <div className="top-popup profile-popup">
            <div className="profile-details">
              <div className="avatar">PR</div>

              <div>
                <strong>Priya Raghavan</strong>
                <p>Administrator</p>
              </div>
            </div>

            <button className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function OMS() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [orders] = useState([]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(
        search.toLowerCase()
      );

    const matchesFilter =
      filter === "All" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="content">
      <div className="page-actions">
        <button className="primary-button">
          Create Order
        </button>

        <button className="secondary-button">
          Generate Invoice
        </button>
      </div>

      <div className="summary-grid">
        <Summary
          title="Total Orders"
          value={orders.length}
        />

        <Summary
          title="Processing"
          value="0"
        />

        <Summary
          title="Shipped"
          value="0"
        />

        <Summary
          title="Delivered"
          value="0"
        />
      </div>

      <section className="panel">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search orders"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">All</option>

            {orderStatuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        <OrderTable orders={filteredOrders} />
      </section>

      <OrderLifecycle />

      <div className="feature-grid">
        <FeatureCard
          title="Payment Tracking"
          description="Track order payment status."
        />

        <FeatureCard
          title="Status History"
          description="View order status history."
        />

        <FeatureCard
          title="Cancellation"
          description="Manage order cancellation."
        />

        <FeatureCard
          title="Return"
          description="Manage order returns."
        />

        <FeatureCard
          title="Refund"
          description="Manage order refunds."
        />

        <FeatureCard
          title="Invoice"
          description="Generate order invoices."
        />
      </div>

      <Pagination />
    </main>
  );
}

function OrderTable({ orders }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="4">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>

                <td>
                  <StatusBadge
                    status={order.status}
                  />
                </td>

                <td>
                  {order.paymentStatus}
                </td>

                <td>View</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function OrderLifecycle() {
  return (
    <section className="panel">
      <h2>Order Lifecycle</h2>

      <div className="lifecycle">
        {orderStatuses.map((status) => (
          <div
            className="lifecycle-step"
            key={status}
          >
            <span>{status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
function DeliveryEngine() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deliveries] = useState([]);

  const filteredDeliveries =
    deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.id?.toLowerCase().includes(
          search.toLowerCase()
        );

      const matchesFilter =
        filter === "All" ||
        delivery.status === filter;

      return (
        matchesSearch && matchesFilter
      );
    });

  return (
    <main className="content">
      <div className="page-actions">
        <button className="primary-button">
          Create Delivery
        </button>

        <button className="secondary-button">
          Assign Partner
        </button>
      </div>

      <div className="summary-grid">
        <Summary
          title="Total Deliveries"
          value={deliveries.length}
        />

        <Summary
          title="In Transit"
          value="0"
        />

        <Summary
          title="Out for Delivery"
          value="0"
        />

        <Summary
          title="Delivered"
          value="0"
        />
      </div>

      <section className="panel">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search deliveries"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">All</option>

            {deliveryStatuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        <DeliveryTable
          deliveries={filteredDeliveries}
        />
      </section>

      <DeliveryLifecycle />

      <div className="feature-grid">
        <FeatureCard
          title="Delivery Partners"
          description="Manage delivery partners."
        />

        <FeatureCard
          title="Tracking"
          description="Track delivery status."
        />

        <FeatureCard
          title="Proof of Delivery"
          description="Manage proof of delivery."
        />

        <FeatureCard
          title="Failed Delivery"
          description="Manage failed deliveries."
        />

        <FeatureCard
          title="Return"
          description="Manage delivery returns."
        />

        <FeatureCard
          title="Notifications"
          description="Manage delivery notifications."
        />

        <FeatureCard
          title="Status History"
          description="View delivery status history."
        />
      </div>

      <Pagination />
    </main>
  );
}

function DeliveryTable({ deliveries }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Delivery ID</th>
            <th>Status</th>
            <th>Partner</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan="4">
                No deliveries found.
              </td>
            </tr>
          ) : (
            deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td>{delivery.id}</td>

                <td>
                  <StatusBadge
                    status={delivery.status}
                  />
                </td>

                <td>{delivery.partner}</td>

                <td>View</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function DeliveryLifecycle() {
  return (
    <section className="panel">
      <h2>Delivery Lifecycle</h2>

      <div className="lifecycle">
        {deliveryStatuses.map((status) => (
          <div
            className="lifecycle-step"
            key={status}
          >
            <span>{status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Summary({ title, value }) {
  return (
    <div className="summary-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="status-badge">
      {status}
    </span>
  );
}

function FeatureCard({
  title,
  description,
}) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Pagination() {
  return (
    <div className="pagination">
      <button>Previous</button>

      <span>Page 1</span>

      <button>Next</button>
    </div>
  );
}

function CreateOrderModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Order</h2>

        <input
          type="text"
          placeholder="Order ID"
        />

        <select>
          <option>Select Status</option>

          {orderStatuses.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="primary-button">
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateDeliveryModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Delivery</h2>

        <input
          type="text"
          placeholder="Delivery ID"
        />

        <select>
          <option>Select Status</option>

          {deliveryStatuses.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="primary-button">
            Create Delivery
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;