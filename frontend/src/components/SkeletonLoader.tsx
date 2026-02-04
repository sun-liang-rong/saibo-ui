import { Card, Skeleton } from 'antd';

export function TableSkeleton() {
  return (
    <div className="fade-in">
      <Skeleton active paragraph={{ rows: 1 }} style={{ marginBottom: 16 }} />
      <Card>
        <Skeleton active />
      </Card>
    </div>
  );
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="fade-in">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} style={{ marginBottom: 16 }}>
          <Skeleton active />
        </Card>
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="fade-in" style={{ marginBottom: 24 }}>
      <Skeleton.Input active size="large" style={{ width: 200, marginBottom: 8 }} />
      <Skeleton.Input active style={{ width: 150 }} />
    </div>
  );
}
