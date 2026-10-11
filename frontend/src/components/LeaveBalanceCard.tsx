import React from 'react';
import { Calendar, PlusCircle } from 'lucide-react';

interface LeaveBalanceCardProps {
  total?: number;
  used?: number;
  remaining?: number;
  onApplyLeave?: () => void;
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  total = 8,
  used = 0,
  remaining = 8,
  onApplyLeave,
}) => {
  const percentage = Math.min(100, Math.round((remaining / total) * 100));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leave Year 2026–2027</span>
            <h3 className="text-base font-bold text-slate-900 leading-tight">Paid Leave Balance</h3>
          </div>
        </div>

        {onApplyLeave && (
          <button
            onClick={onApplyLeave}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Apply</span>
          </button>
        )}
      </div>

      {/* Numerical Stats */}
      <div className="grid grid-cols-3 gap-2 py-2">
        <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 block">Total</span>
          <span className="text-xl font-extrabold text-slate-800">{total}</span>
          <span className="text-[10px] text-slate-400 block">Days</span>
        </div>
        <div className="bg-amber-50/50 rounded-2xl p-3 text-center border border-amber-100">
          <span className="text-[11px] font-medium text-amber-600 block">Used</span>
          <span className="text-xl font-extrabold text-amber-700">{used}</span>
          <span className="text-[10px] text-amber-600/70 block">Days</span>
        </div>
        <div className="bg-emerald-50/50 rounded-2xl p-3 text-center border border-emerald-100">
          <span className="text-[11px] font-medium text-emerald-600 block">Remaining</span>
          <span className="text-xl font-extrabold text-emerald-700">{remaining}</span>
          <span className="text-[10px] text-emerald-600/70 block">Days</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
          <span>Available Allowance</span>
          <span className="font-bold text-slate-700">{percentage}% remaining</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              remaining > 3 ? 'bg-emerald-500' : remaining > 0 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-400 text-center">
        Unpaid leave does not reduce your 8 paid leave days.
      </div>
    </div>
  );
};
