
const NavigationBorad = () => {
  return (
    <div
      className="w-full max-w-[400px] mt-10 mx-auto rounded-lg p-2 bg-green-700 [&>*]:text-white [&>*]:mb-2 [&>*]:p-2 Y-tab:[&>p]:text-lg Y-tab:max-w-[560px] X-tab:[&>p]:text-lg"
    >
      <h1 className="text-2xl">☆グッズの仕様のご案内☆</h1>
      <p>グッズの情報は共有で利用されます。</p>
      <p>作成したグッズの情報は変更・削除できません。</p>
      <p>
        ただし詳細ページで変更すると、あなたにとっての見た目のみが変更されます。<br />
        例えば登録済みのグッズのカテゴリー名を変更した場合、<br />
        カテゴリーの所属が変わるわけではなくて、見た目の名前が変わります。<br />
        その為、同じカテゴリーに所属する他のグッズのところでもその名前で表示されます。
      </p>
    </div>
  )
}

export default NavigationBorad
