document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("react-app");
    if (!root) return;

    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const { useState } = React;
    const moment = window.moment;

    const DateCalculator = () => {
        const [dateInput, setDateInput] = useState("");
        const [amount, setAmount] = useState("");
        const [unit, setUnit] = useState("days");
        const [result, setResult] = useState("");
        const [extraInfo, setExtraInfo] = useState("");

        const handleCalculate = () => {
            if (!dateInput) {
                setResult("Enter a valid date.");
                setExtraInfo("");
                return;
            }
            const parsedDate = moment(dateInput, "YYYY-MM-DD", true);
            if (!parsedDate.isValid()) {
                setResult("Invalid date format (use YYYY-MM-DD).");
                setExtraInfo("");
                return;
            }

            const newDate = parsedDate.add(Number(amount) || 0, unit);
            setResult(`New date: ${newDate.format("YYYY-MM-DD")}`);

            // Extra Date Details
            setExtraInfo(
                `Week of the Year: ${newDate.isoWeek()} | ` +
                `Day of the Week: ${newDate.format("dddd")}`
            );
        };

        return React.createElement(
            "div",
            { className: "card shadow-sm p-4" },
            React.createElement("h3", { className: "mb-3 text-center" }, "Date Calculator"),
            React.createElement("div", { className: "mb-3" },
                React.createElement("label", { className: "form-label" }, "Enter Date (YYYY-MM-DD)"),
                React.createElement("input", {
                    type: "text",
                    className: "form-control",
                    placeholder: "YYYY-MM-DD",
                    value: dateInput,
                    onChange: (e) => setDateInput(e.target.value),
                })
            ),
            React.createElement("div", { className: "mb-3" },
                React.createElement("label", { className: "form-label" }, "Amount to Add"),
                React.createElement("input", {
                    type: "number",
                    className: "form-control",
                    placeholder: "Enter amount",
                    value: amount,
                    onChange: (e) => setAmount(e.target.value),
                })
            ),
            React.createElement("div", { className: "mb-3" },
                React.createElement("label", { className: "form-label" }, "Select Unit"),
                React.createElement(
                    "div",
                    { className: "input-group" }, // Bootstrap input group wrapper
                    React.createElement(
                        "select",
                        {
                            className: "form-select", // Ensures Bootstrap styling
                            value: unit,
                            onChange: (e) => setUnit(e.target.value),
                        },
                        ["days", "months", "years"].map((u) =>
                            React.createElement("option", { key: u, value: u }, u)
                        )
                    )
                )
            ),
            React.createElement(
                "button",
                { className: "btn btn-primary w-100", onClick: handleCalculate },
                "Calculate"
            ),
            result &&
            React.createElement(
                "div",
                { className: "alert alert-success mt-3 text-center" },
                React.createElement("p", { className: "mb-1" }, result),
                React.createElement("p", { className: "text-muted small" }, extraInfo)
            )
        );
    };

    ReactDOM.createRoot(root).render(React.createElement(DateCalculator));
});
