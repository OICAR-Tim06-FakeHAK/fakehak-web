import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StatusBadge, Button, EmptyState, ErrorBanner, Input, Select, Spinner } from "../../components/ui/index.jsx";

describe("StatusBadge", () => {
  it("displays label for ACTIVE status", () => {
    render(<StatusBadge status="ACTIVE" />);
    expect(screen.getByText("Aktivan")).toBeInTheDocument();
  });

  it("displays label for IN_PROGRESS status", () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText("U tijeku")).toBeInTheDocument();
  });

  it("displays label for RESOLVED status", () => {
    render(<StatusBadge status="RESOLVED" />);
    expect(screen.getByText("Riješen")).toBeInTheDocument();
  });

  it("displays label for CLOSED status", () => {
    render(<StatusBadge status="CLOSED" />);
    expect(screen.getByText("Zatvoren")).toBeInTheDocument();
  });
});

describe("Button", () => {
  it("calls onClick handler when clicked", () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handler = vi.fn();
    render(<Button onClick={handler} disabled>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("renders children correctly", () => {
    render(<Button>Test text</Button>);
    expect(screen.getByText("Test text")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("displays title", () => {
    render(<EmptyState icon="briefcase" title="No data" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("displays subtitle when provided", () => {
    render(<EmptyState icon="briefcase" title="No data" subtitle="Try again" />);
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("renders without subtitle", () => {
    render(<EmptyState icon="briefcase" title="No data" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });
});

describe("ErrorBanner", () => {
  it("renders nothing when message is empty", () => {
    const { container } = render(<ErrorBanner message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("displays error message", () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders nothing when message is null", () => {
    const { container } = render(<ErrorBanner message={null} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("Input", () => {
  it("renders text input by default", () => {
    render(<Input value="" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input label="Username" value="" onChange={() => {}} />);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders textarea when multiline is true", () => {
    const { container } = render(<Input multiline value="" onChange={() => {}} />);
    expect(container.querySelector("textarea")).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    const handler = vi.fn();
    render(<Input value="" onChange={handler} placeholder="Type here" />);
    fireEvent.change(screen.getByPlaceholderText("Type here"), {
      target: { value: "hello" },
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("renders as disabled when disabled prop is true", () => {
    render(<Input value="" onChange={() => {}} placeholder="Type here" disabled />);
    expect(screen.getByPlaceholderText("Type here")).toBeDisabled();
  });
});

describe("Select", () => {
  const options = [
    { value: "1", label: "Option One" },
    { value: "2", label: "Option Two" },
    { value: "3", label: "Option Three" },
  ];

  it("renders all options", () => {
    render(<Select value="" onChange={() => {}} options={options} />);
    expect(screen.getByText("Option One")).toBeInTheDocument();
    expect(screen.getByText("Option Two")).toBeInTheDocument();
    expect(screen.getByText("Option Three")).toBeInTheDocument();
  });

  it("renders placeholder when provided", () => {
    render(<Select value="" onChange={() => {}} options={options} placeholder="— Choose —" />);
    expect(screen.getByText("— Choose —")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Select label="Status" value="" onChange={() => {}} options={options} />);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("calls onChange when selection changes", () => {
    const handler = vi.fn();
    render(<Select value="" onChange={handler} options={options} />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "2" },
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("renders as disabled when disabled prop is true", () => {
    render(<Select value="" onChange={() => {}} options={options} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});

describe("Spinner", () => {
  it("renders without crashing", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies custom size", () => {
    const { container } = render(<Spinner size={40} />);
    expect(container.firstChild).toHaveStyle({ width: "40px", height: "40px" });
  });

  it("applies custom color", () => {
    const { container } = render(<Spinner color="#ff0000" />);
    expect(container.firstChild).toHaveStyle({ borderTopColor: "#ff0000" });
  });
});