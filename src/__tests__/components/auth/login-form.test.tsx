import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/contexts/auth-context";

jest.mock("@/contexts/auth-context");
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("LoginForm", () => {
  const mockLogin = jest.fn();
  const mockOnToggleMode = jest.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar formulário de login", () => {
    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    expect(
      screen.getByText("Entre com suas credenciais para acessar sua conta")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("deve permitir digitação nos campos", async () => {
    const user = userEvent.setup();
    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("deve alternar visibilidade da senha", async () => {
    const user = userEvent.setup();
    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const passwordInput = screen.getByLabelText("Senha");
    const toggleButton = screen.getByRole("button", { name: "" });

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("deve chamar login com dados corretos", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ success: true });

    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("deve mostrar erro quando login falha", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      success: false,
      error: "Credenciais inválidas",
    });

    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
  });

  it("deve mostrar erro genérico quando não há erro específico", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      success: false,
    });

    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("Email ou senha incorretos")).toBeInTheDocument();
  });

  it("deve mostrar erro quando login lança exceção", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Network error"));

    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(
      screen.getByText("Erro ao fazer login. Tente novamente.")
    ).toBeInTheDocument();
  });

  it("deve desabilitar campos durante carregamento", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    });

    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: "Entrando..." });

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("deve chamar onToggleMode quando clica em criar conta", async () => {
    const user = userEvent.setup();
    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const toggleButton = screen.getByRole("button", { name: "Criar conta" });
    await user.click(toggleButton);

    expect(mockOnToggleMode).toHaveBeenCalledTimes(1);
  });

  it("deve mostrar contas de teste", () => {
    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    expect(screen.getByText("Contas de teste:")).toBeInTheDocument();
    expect(screen.getByText(/vylex@email\.com/)).toBeInTheDocument();
    expect(screen.getByText(/123456/)).toBeInTheDocument();
  });

  it("deve limpar erro ao submeter novamente", async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValueOnce({
      success: false,
      error: "Erro inicial",
    });

    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("Erro inicial")).toBeInTheDocument();

    mockLogin.mockResolvedValueOnce({ success: true });
    await user.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryByText("Erro inicial")).not.toBeInTheDocument();
  });

  it("deve ter campos obrigatórios", () => {
    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it("deve ter tipos de input corretos", () => {
    render(<LoginForm onToggleMode={mockOnToggleMode} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
