import type { CustomerSharePreview } from "../domain/types";

type SharePreviewProps = {
  preview: CustomerSharePreview;
};

export function SharePreview({ preview }: SharePreviewProps) {
  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <p className="sectionLabel">Customer Preview</p>
          <h2>顧客共有プレビュー</h2>
        </div>
        <span className="statusPill success">内部メモ除外</span>
      </div>

      <p className="previewLead">
        {preview.customer.primaryName}様 / {preview.customer.partnerName}様向け
      </p>

      <dl className="detailGrid compact">
        <div>
          <dt>案件</dt>
          <dd>{preview.case.title}</dd>
        </div>
        <div>
          <dt>会場候補</dt>
          <dd>{preview.case.venueCandidate}</dd>
        </div>
        <div>
          <dt>希望</dt>
          <dd>{preview.case.stylePreference}</dd>
        </div>
      </dl>

      <h3 className="subheading">共有メモ</h3>
      <ul className="plainList">
        {preview.meeting.publicNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <h3 className="subheading">共有される要約</h3>
      <ul className="plainList">
        {preview.meeting.summary?.decisions.map((item) => (
          <li key={item}>決定: {item}</li>
        ))}
        {preview.meeting.summary?.openQuestions.map((item) => (
          <li key={item}>未決: {item}</li>
        ))}
      </ul>
    </section>
  );
}
