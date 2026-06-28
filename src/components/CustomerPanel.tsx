import { useState } from "react";
import type { Customer, WeddingCase } from "../domain/types";

type CustomerPanelProps = {
  customer: Customer;
  weddingCase: WeddingCase;
  onCustomerSave: (patch: Partial<Customer>) => void;
  onCaseSave: (patch: Partial<WeddingCase>) => void;
};

export function CustomerPanel({
  customer,
  weddingCase,
  onCustomerSave,
  onCaseSave
}: CustomerPanelProps) {
  const [primaryName, setPrimaryName] = useState(customer.primaryName);
  const [partnerName, setPartnerName] = useState(customer.partnerName);
  const [venueCandidate, setVenueCandidate] = useState(weddingCase.venueCandidate);
  const [stylePreference, setStylePreference] = useState(weddingCase.stylePreference);
  const saveChanges = () => {
    onCustomerSave({ primaryName, partnerName });
    onCaseSave({ venueCandidate, stylePreference });
  };

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <p className="sectionLabel">Customer</p>
          <h2>顧客・案件</h2>
        </div>
        <span className="statusPill">{weddingCase.status}</span>
      </div>

      <dl className="detailGrid">
        <div>
          <dt>新郎新婦</dt>
          <dd>
            {customer.primaryName} / {customer.partnerName}
          </dd>
        </div>
        <div>
          <dt>案件</dt>
          <dd>{weddingCase.title}</dd>
        </div>
        <div>
          <dt>挙式予定</dt>
          <dd>{weddingCase.weddingDate ?? "未定"}</dd>
        </div>
        <div>
          <dt>会場候補</dt>
          <dd>{weddingCase.venueCandidate}</dd>
        </div>
        <div>
          <dt>予算感</dt>
          <dd>{weddingCase.budgetRange}</dd>
        </div>
        <div>
          <dt>連絡手段</dt>
          <dd>{customer.preferredContact.toUpperCase()}</dd>
        </div>
      </dl>

      <div className="tagRow" aria-label="顧客タグ">
        {customer.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <details className="disclosureForm">
        <summary>顧客・案件を編集</summary>
        <form
          className="editForm"
          onSubmit={(event) => {
            event.preventDefault();
            saveChanges();
          }}
        >
          <label>
            顧客名
            <input
              value={primaryName}
              onChange={(event) => setPrimaryName(event.target.value)}
            />
          </label>
          <label>
            パートナー名
            <input
              value={partnerName}
              onChange={(event) => setPartnerName(event.target.value)}
            />
          </label>
          <label>
            会場候補
            <input
              value={venueCandidate}
              onChange={(event) => setVenueCandidate(event.target.value)}
            />
          </label>
          <label>
            希望スタイル
            <textarea
              value={stylePreference}
              onChange={(event) => setStylePreference(event.target.value)}
              rows={3}
            />
          </label>
          <button type="submit">顧客・案件を保存</button>
        </form>
      </details>
    </section>
  );
}
