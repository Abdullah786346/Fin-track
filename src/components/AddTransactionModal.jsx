import { useState, useEffect } from "react";
import { X } from "lucide-react";

/* 
  CHANGES:
  - Destructured editingTransaction prop.
  - Added useEffect hook to populate form fields when in edit mode (editingTransaction is not null)
    and reset them when creating a new record.
*/
export default function AddTransactionModal({ open, onClose, onSave, editingTransaction }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      if (editingTransaction) {
        setType(editingTransaction.type || "expense");
        setAmount(editingTransaction.amount ? String(editingTransaction.amount) : "");
        setCategory(editingTransaction.category || "");
        setDescription(editingTransaction.description || "");
        setDate(editingTransaction.date || "");
        setNotes(editingTransaction.notes || "");
      } else {
        setType("expense");
        setAmount("");
        setCategory("");
        setDescription("");
        setDate("");
        setNotes("");
      }
    }
  }, [editingTransaction, open]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !category || !description || !date) {
      return;
    }

    /* 
      CHANGES:
      - Preserve the original ID when updating a transaction, otherwise generate a new one.
    */
    const transaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      type,
      amount: parsedAmount,
      category,
      description,
      date,
      notes,
    };

    onSave?.(transaction);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          p-6
        "
      >
        <div
          className="w-full max-w-xl max-h-[90vh] rounded-3xl bg-white  shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 ">
            {/* CHANGES: Dynamically update modal title depending on add/edit mode */}
            <h2 className="text-2xl font-bold text-slate-900 ">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-slate-100  transition"
            >
              <X className="w-5 h-5 text-slate-500 " />
            </button>
          </div>

          <form className="flex flex-col h-full overflow-hidden" onSubmit={handleSubmit}>
            {/* Body */}
            <div
              className="
                flex-1
                overflow-y-auto
                p-6
                space-y-5
              "
            >
              {/* Expense / Income */}
              <div className="grid grid-cols-2 rounded-xl bg-white  border border-slate-200  p-1">
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`rounded-lg py-3 font-semibold transition ${
                    type === "expense"
                      ? "bg-red-500 text-white"
                      : "text-slate-600 "
                  }`}
                >
                  Expense
                </button>

                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`rounded-lg py-3 font-semibold transition ${
                    type === "income"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-600 "
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 ">Amount</label>

                {/* 
                  CHANGES:
                  - Added onWheel={(e) => e.target.blur()} to prevent accidental mouse wheel scrolls 
                    from changing the amount value when the input is focused.
                */}
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="w-full rounded-xl border border-slate-300  bg-white  text-slate-900  px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 ">Category</label>

                {/* 
                  CHANGES:
                  - Render different options depending on whether type is expense or income.
                  - Added all required categories: Food, Rent/Housing, Utilities, Transport, Bills, Shopping, Entertainment, Health, Education, Salary, Freelance, Investment, Other.
                */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300  bg-white  text-slate-900  px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select category</option>
                  {type === "expense" ? (
                    <>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Housing">Housing</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Bills">Bills</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 ">Description</label>

                <input
                  type="text"
                  placeholder="What was this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300  bg-white  text-slate-900  px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 ">Date</label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300  bg-white  text-slate-900  px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 ">Notes (optional)</label>

                <textarea
                  rows={4}
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300  bg-white  text-slate-900  px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200  p-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300  text-slate-700  px-5 py-2 font-medium hover:bg-slate-100  transition"
              >
                Cancel
              </button>

              {/* CHANGES: Dynamically update button text based on add/edit mode */}
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-700 transition"
              >
                {editingTransaction ? "Update Transaction" : "Save Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
